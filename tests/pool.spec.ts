var should    = require('chai').should();
var supertest = require('supertest');
var api       = supertest('http://localhost:3000/api');

describe('Pool unit tests:', () => {
    it('Should create a Pool instance', (done: Function) => {
        api.post('/Pools').send({
            guid: 'test',
            name: 'test'
        }).expect(200, done);
    });
});
