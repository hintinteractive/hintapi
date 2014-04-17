var colors = require('colors'),
	should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config'),
    api = supertest(config.api_url),
    common = require('./common');

var commonObj = {};

describe('Authenticate', function () {
    it('login the user and gets hint auth token', common.getAuthToken(commonObj, "auth_token"));
});

describe('POST /api/event', function () {
    it('creates an event', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.post('/api/event')
        .send({
            hair_color: _hair_color
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-ZUMO-AUTH', commonObj['auth_token'])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.property('api_access').and.be.true;
            res.body.should.have.deep.property('result.hair_color').and.equal(_hair_color);
            if (config.verbose) console.log("POST /api/event response:".underline.green , JSON.stringify(res.body));
            done();
        });
    });

});



    