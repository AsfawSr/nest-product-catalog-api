import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserRole } from './enums/user-role.enum.js';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;

  beforeEach(() => {
    mockUserRepository = {
      findOne: vi.fn(),
      create: vi.fn((entity) => ({ id: 1, ...entity })),
      save: vi.fn((entity) => Promise.resolve({ id: 1, ...entity })),
    };

    mockJwtService = {
      sign: vi.fn(() => 'mock-jwt-token'),
    };

    authService = new AuthService(mockUserRepository, mockJwtService);
  });

  describe('register', () => {
    it('should register a new user successfully and return JWT', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        role: UserRole.USER,
      });

      expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
      expect(result.user).toEqual({
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash,
        role: UserRole.ADMIN,
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'CorrectPassword123!',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const passwordHash = await bcrypt.hash('OtherPassword123!', 10);
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash,
        role: UserRole.USER,
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
