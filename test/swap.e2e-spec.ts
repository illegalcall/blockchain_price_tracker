import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp, clearDatabase } from './test.utils';

describe('SwapModule (e2e)', () => {
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

  describe('/swap', () => {
    it('should get swap quote', async () => {
      const quoteParams = {
        fromToken: 'ETH',
        toToken: 'USDC',
        amount: '1.0',
      };

      const response = await request(app.getHttpServer())
        .get('/swap/quote')
        .query(quoteParams)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.fromAmount).toBeDefined();
      expect(response.body.toAmount).toBeDefined();
      expect(response.body.estimatedGas).toBeDefined();
    });

    it('should validate swap parameters', async () => {
      const invalidQuoteParams = {
        fromToken: 'INVALID_TOKEN',
        toToken: 'USDC',
        amount: '1.0',
      };

      await request(app.getHttpServer())
        .get('/swap/quote')
        .query(invalidQuoteParams)
        .expect(400);
    });

    it('should execute swap', async () => {
      const swapParams = {
        fromToken: 'ETH',
        toToken: 'USDC',
        amount: '1.0',
        slippage: '0.5',
        walletAddress: '0x1234567890123456789012345678901234567890',
      };

      const response = await request(app.getHttpServer())
        .post('/swap/execute')
        .send(swapParams)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.transactionHash).toBeDefined();
      expect(response.body.status).toBeDefined();
    });
  });
}); 