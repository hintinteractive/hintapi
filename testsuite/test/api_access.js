var colors = require('colors'),
	should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config'),
    api = supertest(config.api_url),
    common = require('./common');

var commonObj = {};
var commonObj2 = {};

describe('Authenticate', function () {
    it('login the user and gets hint auth token', common.getAuthToken(commonObj, "auth_token"));
    it('login the user2 and gets hint auth token', common.getAuthToken2(commonObj2, "auth_token"));
});

describe('GET /api/unittest/api_access', function () {
    it('gets the user', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-ZUMO-AUTH', commonObj['auth_token'])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
        	if (err) return done(err);
            res.body.should.have.property('api_access').and.be.true;
            done();
        });
    });
    it('gets the last entry of the api access table', function (done) {
        api.get('/api/unittest/api_access')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('__v');
                res.body.should.have.property('_id');
                res.body.should.have.deep.property('access.device').and.equal('test-computer');
                res.body.should.have.deep.property('access.time');
                res.body.should.have.deep.property('api.name').and.equal('user');
                res.body.should.have.deep.property('api.method').and.equal('GET');
                res.body.should.have.deep.property('app._id');
                res.body.should.have.deep.property('app.social_id').and.have.string('Facebook:');
                res.body.should.have.deep.property('user.social_id').and.have.string('Facebook:');
                res.body.should.have.deep.property('user._id');
                
                if (config.verbose) console.log("GET /api/unittest/api_access :".underline.green, JSON.stringify(res.body));
                done();
            });
    });

});


/*
    Authenticate second user
*/


describe('GET /api/unittest/api_access', function () {
    it('gets the user', function (done) {
        if (!commonObj2['auth_token']) done("Not Authenticated");
        api.get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-ZUMO-AUTH', commonObj2['auth_token'])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.property('api_access').and.be.true;
            done();
        });
    });
    it('gets the last entry of the api access table', function (done) {
        api.get('/api/unittest/api_access')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj2['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('__v');
                res.body.should.have.property('_id');
                res.body.should.have.deep.property('access.device').and.equal('test-computer');
                res.body.should.have.deep.property('access.time');
                res.body.should.have.deep.property('api.name').and.equal('user');
                res.body.should.have.deep.property('api.method').and.equal('GET');
                res.body.should.have.deep.property('app._id');
                res.body.should.have.deep.property('app.social_id').and.have.string('Facebook:');
                res.body.should.have.deep.property('user.social_id').and.have.string('Facebook:');
                res.body.should.have.deep.property('user._id');
                
                if (config.verbose) console.log("GET /api/unittest/api_access :".underline.green, JSON.stringify(res.body));
                done();
            });
    });

});

    