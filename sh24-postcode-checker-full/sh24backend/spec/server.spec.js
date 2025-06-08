const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/index');

describe('API endpoints', () => {

  it('GET / should return welcome text', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Backend with CSV overwrite based on filename');
  });

  it('POST /check-postcode without postcode should return 400', async () => {
    const res = await request(app).post('/check-postcode').send({});
    expect(res.status).toBe(400);
    expect(res.body.allowed).toBe(false);
    expect(res.body.reason).toBe("Postcode is required");
  });

  it('POST /api/upload-csv without file should return 400', async () => {
    const res = await request(app)
      .post('/api/upload-csv')
      .field('type', 'manually_allowed');

    expect(res.status).toBe(400);
    expect(res.text).toBe('No file uploaded.');
  });

  it('POST /api/upload-csv with invalid type should return 400', async () => {
    const res = await request(app)
      .post('/api/upload-csv')
      .field('type', 'invalid_type')
      .attach('file', Buffer.from('a,b\n1,2'), 'test.csv');

    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid type. Use "manually_allowed" or "allowed_lsoa_prefixes".');
  });

  it('POST /api/upload-csv with valid file and type should return 200', async () => {
    const res = await request(app)
      .post('/api/upload-csv')
      .field('type', 'manually_allowed')
      .attach('file', Buffer.from('a,b\n1,2'), 'test.csv');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Successfully replaced manually_allowed.csv');

    // Cleanup
    const filePath = path.join(__dirname, '../src/uploads/manually_allowed.csv');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
});
