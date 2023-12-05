import { FastifyInstance } from 'fastify';
import { server } from '../src/app';

describe('Example Route', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = server;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond with status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    });

    expect(response.statusCode).toBe(200);
  });

});
