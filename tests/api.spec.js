import request from 'supertest';
import app from '../src/app.js';

// Cuentas del seed (database/seed.sql)
const ADMIN = { email: 'admin@marketgaming.cl', password: 'admin123' };
const CLIENTE = { email: 'ana.rojas@email.cl', password: '123456' };

// Ningún test crea filas: la base es compartida por el equipo
describe('API MarketGaming', () =>
{
    let tokenAdmin;
    let tokenCliente;

    beforeAll(async () =>
    {
        const respuestaAdmin = await request(app).post('/login').send(ADMIN);
        tokenAdmin = respuestaAdmin.body.token;

        const respuestaCliente = await request(app).post('/login').send(CLIENTE);
        tokenCliente = respuestaCliente.body.token;
    });

    it('GET /categories responde 200 con un arreglo', async () =>
    {
        const res = await request(app).get('/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /login responde 401 con una clave incorrecta', async () =>
    {
        const res = await request(app).post('/login').send({ email: ADMIN.email, password: 'mala' });
        expect(res.statusCode).toBe(401);
    });

    it('POST /login responde 200 y entrega un token', async () =>
    {
        const res = await request(app).post('/login').send(ADMIN);
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('GET /users/me responde 401 sin token', async () =>
    {
        const res = await request(app).get('/users/me');
        expect(res.statusCode).toBe(401);
    });

    it('GET /users/me responde 200 con token', async () =>
    {
        const res = await request(app).get('/users/me').set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(ADMIN.email);
    });

    it('POST /users responde 400 si falta el email', async () =>
    {
        const res = await request(app).post('/users').send({ name: 'Prueba', password: '123456' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /users responde 409 si el correo ya existe', async () =>
    {
        const res = await request(app).post('/users').send({ name: 'Prueba', email: ADMIN.email, password: '123456' });
        expect(res.statusCode).toBe(409);
    });

    it('GET /products responde 200 con results', async () =>
    {
        const res = await request(app).get('/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it('GET /products/999999 responde 404', async () =>
    {
        const res = await request(app).get('/products/999999');
        expect(res.statusCode).toBe(404);
    });

    it('POST /products responde 403 con token de cliente', async () =>
    {
        const res = await request(app).post('/products').set('Authorization', `Bearer ${tokenCliente}`).send({});
        expect(res.statusCode).toBe(403);
    });

    it('GET /cart responde 200 con token de cliente', async () =>
    {
        const res = await request(app).get('/cart').set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('GET /admin/stats responde 403 con token de cliente', async () =>
    {
        const res = await request(app).get('/admin/stats').set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.statusCode).toBe(403);
    });
});
