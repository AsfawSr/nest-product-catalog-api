import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserOrmEntity } from './entities/user.orm-entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto.js';
import { UserRole } from './enums/user-role.enum.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAccounts();
  }

  private async seedDefaultAccounts() {
    const adminEmail = 'admin@store.com';
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin123!', 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      this.logger.log(`Default ADMIN created: ${adminEmail} (password: Admin123!)`);
    }

    const customerEmail = 'customer@store.com';
    const existingCustomer = await this.userRepository.findOne({ where: { email: customerEmail } });

    if (!existingCustomer) {
      const passwordHash = await bcrypt.hash('Customer123!', 10);
      const customer = this.userRepository.create({
        email: customerEmail,
        passwordHash,
        role: UserRole.USER,
      });
      await this.userRepository.save(customer);
      this.logger.log(`Default CUSTOMER created: ${customerEmail} (password: Customer123!)`);
    }
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException(`User with email "${dto.email}" is already registered`);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      role: dto.role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    const token = this.generateToken(savedUser);

    return {
      accessToken: token,
      user: this.mapToProfile(savedUser),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: this.mapToProfile(user),
    };
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return this.mapToProfile(user);
  }

  private generateToken(user: UserOrmEntity): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private mapToProfile(user: UserOrmEntity): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
