// In your tests file (userRoutes.test.js)
const request = require('supertest');
const app = require('../app');

describe('POST /users/:username/jobs/:id', function() {
  it('should apply for a job', async function() {
    const resp = await request(app)
      .post('/users/testuser/jobs/1')
      .send({}); // Include any needed body data
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ applied: 1 });
  });
});

describe('GET /users/:username', function() {
  it('should return user info with applied jobs', async function() {
    const resp = await request(app).get('/users/testuser');
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      username: 'testuser',
      email: 'testuser@example.com',
      first_name: 'Test',
      last_name: 'User',
      jobs: [1] // Expected job IDs
    });
  });
});
