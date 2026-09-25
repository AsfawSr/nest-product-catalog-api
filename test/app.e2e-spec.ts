import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter.js';

describe('NestStore E2E Integration Suite', () => {
  let app: INestApplication;
  let adminToken: string;
  let customerToken: string;
  let createdProductId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());

    await app.init();
  }, 15000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Health Check Endpoint', () => {
    it('GET /health - should return service health status', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication & Identity Flow', () => {
    it('POST /auth/login - should authenticate seeded admin and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@store.com',
          password: 'Admin123!',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toMatchObject({
        email: 'admin@store.com',
        role: 'ADMIN',
      });

      adminToken = res.body.accessToken;
    });

    it('POST /auth/login - should authenticate seeded customer and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'customer@store.com',
          password: 'Customer123!',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toMatchObject({
        email: 'customer@store.com',
        role: 'USER',
      });

      customerToken = res.body.accessToken;
    });

    it('GET /auth/me - should reject request without token with 401', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('GET /auth/me - should return authenticated user profile with valid Bearer token', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('email', 'admin@store.com');
      expect(res.body).toHaveProperty('role', 'ADMIN');
    });
  });

  describe('Product Catalog & RBAC Flow', () => {
    it('POST /products - should reject unauthenticated request with 401', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Unauthorized Keyboard',
          price: 99.99,
          stock: 10,
          category: 'Hardware',
        })
        .expect(401);
    });

    it('POST /products - should reject customer (USER role) request with 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Forbidden Keyboard',
          price: 99.99,
          stock: 10,
          category: 'Hardware',
        })
        .expect(403);

      expect(res.body.message).toContain('Access denied');
    });

    it('POST /products - should allow ADMIN to create new product with 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'E2E Mechanical Keyboard',
          description: 'RGB Backlit Cherry MX Red',
          price: 129.99,
          stock: 25,
          category: 'Hardware',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('E2E Mechanical Keyboard');
      expect(res.body.price).toBe(129.99);
      expect(res.body.stock).toBe(25);

      createdProductId = res.body.id;
    });

    it('GET /products - should publicly retrieve paginated catalog without authentication', async () => {
      const res = await request(app.getHttpServer())
        .get('/products?page=1&take=10&order=DESC')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('page', 1);
      expect(res.body.meta).toHaveProperty('itemCount');
      expect(res.body.meta.itemCount).toBeGreaterThan(0);
    });

    it('GET /products/:id - should publicly retrieve product by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products/${createdProductId}`)
        .expect(200);

      expect(res.body.id).toBe(createdProductId);
      expect(res.body.name).toBe('E2E Mechanical Keyboard');
    });

    it('PATCH /products/:id - should allow ADMIN to update product details with 200', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 119.99,
          stock: 30,
        })
        .expect(200);

      expect(res.body.price).toBe(119.99);
      expect(res.body.stock).toBe(30);
    });

    it('DELETE /products/:id - should reject customer deletion attempt with 403 Forbidden', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('DELETE /products/:id - should allow ADMIN to delete product with 200', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify it is actually gone
      await request(app.getHttpServer())
        .get(`/products/${createdProductId}`)
        .expect(404);
    });
  });
});
