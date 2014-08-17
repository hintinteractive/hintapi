var colors = require('colors'),
	should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config'),
    api = supertest(config.api_url),
    common = require('./common');

var commonObj = {};
var commonObj2 = {};

describe('Authenticate', function () {
    it('login the user and gets hint auth token', common.getAuthToken(commonObj, "auth_token", config.verbose));
    
});

describe('GET /api/unittest/identity1', function () {
    it('gets the identity object', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.get('/api/unittest/identity')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.deep.property('user.level').and.equal('authenticated');
                res.body.should.have.deep.property('user.userId').and.have.string('Facebook:');
                res.body.should.have.deep.property('identities.facebook.userId').and.equal(res.body.user.userId);
                res.body.should.have.deep.property('identities.facebook.id');
                res.body.should.have.deep.property('identities.facebook.userStatus');
                res.body.should.have.deep.property('identities.facebook.accessToken').and.equal(config.facebook_access_token);
                res.body.should.have.deep.property('identities.facebook.appId');
                res.body.should.have.deep.property('identities.facebook.socialAppId');
                res.body.should.have.deep.property('identities.facebook.device').and.equal('test-computer');
                if (config.verbose) console.log("GET /api/unittest/identity1 :".underline.green, JSON.stringify(res.body));
                done();
            });
    });

});

describe('Authenticate', function () {
    it('login the user2 and gets hint auth token', common.getAuthToken2(commonObj2, "auth_token", config.verbose));
});

describe('GET /api/unittest/identity2', function () {
    it('gets the identity object', function (done) {
        if (!commonObj2['auth_token']) done("Not Authenticated");
        api.get('/api/unittest/identity')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj2['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.deep.property('user.level').and.equal('authenticated');
                res.body.should.have.deep.property('user.userId').and.have.string('Facebook:');
                res.body.should.have.deep.property('identities.facebook.userId').and.equal(res.body.user.userId);
                res.body.should.have.deep.property('identities.facebook.id');
                res.body.should.have.deep.property('identities.facebook.userStatus');
                res.body.should.have.deep.property('identities.facebook.accessToken').and.equal(config.facebook_access_token_2);
                res.body.should.have.deep.property('identities.facebook.appId');
                res.body.should.have.deep.property('identities.facebook.socialAppId');
                res.body.should.have.deep.property('identities.facebook.device').and.equal('test-computer');
                if (config.verbose) console.log("GET /api/unittest/identity2 :".underline.green, JSON.stringify(res.body));
                done();
            });
    });

});



    