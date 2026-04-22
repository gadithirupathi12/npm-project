const request = require('supertest');
const app     = require('../app');
const Database = require('better-sqlite3');

const db = new Database('employees.db');

beforeEach(() => {
  db.exec('DELETE FROM employees');
});

test('GET /employees returns empty array initially', async () => {
  const res = await request(app).get('/employees');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

test('POST /employees adds an employee', async () => {
  const res = await request(app)
    .post('/employees')
    .send({ name: 'Alice' });
  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe('Alice');
  expect(res.body.id).toBeDefined();
});

test('GET /employees returns added employees', async () => {
  await request(app).post('/employees').send({ name: 'Bob' });
  const res = await request(app).get('/employees');
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Bob');
});

test('POST /employees rejects missing name', async () => {
  const res = await request(app).post('/employees').send({});
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Name is required');
});