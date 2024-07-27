const request = require('supertest');
const app = require('../src/app');

describe('/api/:date?', () => {
    test('It should return json', async () => {
        const response = await request(app).get('/api/');
        expect(response.type).toBe('application/json');
    });

    test('It should accept unix format time', async () => {
        const response = await request(app).get('/api/1451001600000');
        expect(response.body).toEqual({
            utc: "Fri, 25 Dec 2015 00:00:00 GMT",
            unix: 1451001600000
        });
    });

    test('It should be able to parse UTC string', async () => {
        const response = await request(app).get('/api/Fri, 25 Dec 2015 00:00:00 GMT');
        expect(response.body).toEqual({
            utc: "Fri, 25 Dec 2015 00:00:00 GMT",
            unix: 1451001600000
        });
    });

    test('It should be able to parse date', async () => {
        const response = await request(app).get('/api/2015-12-25');
        expect(response.body).toEqual({
            utc: "Fri, 25 Dec 2015 00:00:00 GMT",
            unix: 1451001600000
        });
    });

    test('It should return error on invalid date', async () => {
        const response = await request(app).get('/api/25-12');
        expect(response.body).toEqual({
            error: "Invalid Date",
        });
    });

    test('It should return current date if there is no param provided', async () => {
        const response = await request(app).get('/api/');
        const date = Date.now();
        // since request may take more than a millisecond we check with precision of 10 ms
        expect(response.body.unix / 10).toEqual(date / 10);
    });
});