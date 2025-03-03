import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp, clearDatabase } from './test.utils';

describe('PricesModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/prices', () => {
    it('should fetch current prices', async () => {
      const response = await request(app.getHttpServer())
        .get('/prices')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should fetch historical prices', async () => {
      const response = await request(app.getHttpServer())
        .get('/prices/historical')
        .query({
          token: 'ETH',
          from: '2024-01-01',
          to: '2024-03-01',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
}); 