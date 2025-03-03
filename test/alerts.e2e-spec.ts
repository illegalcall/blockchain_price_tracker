import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp, clearDatabase } from './test.utils';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../src/common';

describe('AlertModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/alert', () => {
    it('should create a new price alert', async () => {
      const alertData = {
        chain: SUPPORTED_CHAIN_IDS.ETH_MAINNET,
        price: 3000,
        email: 'test@example.com',
        token: SUPPORTED_TOKENS.ETH,
      };

      const response = await request(app.getHttpServer())
        .post('/alert')
        .send(alertData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('string');
    });

    it('should get alerts by email', async () => {
      // First create an alert
      const alertData = {
        chain: SUPPORTED_CHAIN_IDS.ETH_MAINNET,
        price: 3000,
        email: 'test@example.com',
        token: SUPPORTED_TOKENS.ETH,
      };

      await request(app.getHttpServer())
        .post('/alert')
        .send(alertData)
        .expect(201);

      // Then fetch alerts for the email
      const response = await request(app.getHttpServer())
        .get('/alert/email/test@example.com')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].email).toBe(alertData.email);
    });

    it('should get alert by ID', async () => {
      // First create an alert
      const alertData = {
        chain: SUPPORTED_CHAIN_IDS.ETH_MAINNET,
        price: 3000,
        email: 'test@example.com',
        token: SUPPORTED_TOKENS.ETH,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/alert')
        .send(alertData)
        .expect(201);

      const alertId = createResponse.body;

      // Then fetch the alert by ID
      const response = await request(app.getHttpServer())
        .get(`/alert/id/${alertId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.uuid).toBe(alertId);
      expect(response.body.email).toBe(alertData.email);
    });
  });
});
