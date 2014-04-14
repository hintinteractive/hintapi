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

describe('GET /api/user', function () {
    it('gets the user info', function (done) {
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
                res.body.should.have.deep.property('result.social_id')
                    .and.have.string('Facebook:');
                res.body.should.have.deep.property('result.__v');
                res.body.should.have.deep.property('result._id');
                res.body.should.have.deep.property('result.name');
                res.body.should.have.deep.property('result.contact.email');
                res.body.should.have.deep.property('result.contact.phone');
                res.body.should.have.deep.property('result.hair_color');
                ['light', 'dark', 'undefined'].should.include(res.body.result.hair_color);
                res.body.should.have.deep.property('result.gender');
                ['male', 'female', 'other', 'undefined'].should.include(res.body.result.gender);
                res.body.should.have.deep.property('result.interested_in')
                    .and.be.an.instanceof(Array);
                res.body.should.have.deep.property('result.status');
                ['admin', 'active', 'inactive', 'banned', 'debug'].should.include(res.body.result.status);
               // res.body.should.have.deep.property('result.photo_url');
                res.body.should.have.deep.property('result.black_list')
                    .and.be.an.instanceof(Array);
                if (config.verbose) console.log("GET /api/user response :".underline.green,  JSON.stringify(res.body));
                done();
            });
    });

});


describe('PATCH /api/user', function () {
    it('patches the name', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var newName = 'Test Name' + Date.now();
        api.patch('/api/user')
            .send({
                name: newName
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.name').and.equal(newName);
                if (config.verbose) console.log("PATCH /api/user response (name):".underline.green,  JSON.stringify(res.body));
                done();
            });
    });
    it('patches the email', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var newValue = Date.now() + '@hintinteractive.com';
        api.patch('/api/user')
            .send({
                contact: {
                    email: newValue
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.contact.email').and.equal(newValue);
                res.body.should.have.deep.property('result.contact.phone');
                if (config.verbose) console.log("PATCH /api/user response (email):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('patches the phone', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var newValue = '+1-' + Date.now();
        api.patch('/api/user')
            .send({
                contact: {
                    phone: newValue
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.contact.phone').and.equal(newValue);
                res.body.should.have.deep.property('result.contact.email');
                if (config.verbose) console.log("PATCH /api/user response (phone):".underline.green,  JSON.stringify(res.body));
                done();
            });
    });
    it('patches both email and phone', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var newValuePhone = '+1-' + Date.now();
        var newValueEmail = Date.now()+'@hintinteractive.com';
        api.patch('/api/user')
            .send({
                contact: {
                    phone: newValuePhone,
                    email: newValueEmail
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.contact.phone').and.equal(newValuePhone);
                res.body.should.have.deep.property('result.contact.email').and.equal(newValueEmail);
                if (config.verbose) console.log("PATCH /api/user response (phone,email):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('patches hair_color', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var _hair_color =['light', 'dark', 'undefined'][Math.floor((Math.random()*3))];
        api.patch('/api/user')
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
                if (config.verbose) console.log("PATCH /api/user response (hair_color):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('patches gender', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var index = Date.now()%4;
        var genders = ['male', 'female', 'other', 'undefined'];
        api.patch('/api/user')
            .send({
                gender: genders[index]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.gender').and.equal(genders[index]);
                if (config.verbose) console.log("PATCH /api/user response (gender):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('patches the interested_in', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var _interested_in = ['0' + Date.now(),'1' + Date.now(),'2' + Date.now()];
        api.patch('/api/user')
            .send({
            	interested_in: _interested_in
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.interested_in').and.equal(_interested_in);
                if (config.verbose) console.log("PATCH /api/user response (interested_in):".underline.green ,JSON.stringify(res.body));
                done();
            });
    });
    it('tries to patch status', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        var index = Date.now()%5;
        var statuses = ['admin', 'active', 'inactive', 'banned', 'debug'];
        api.patch('/api/user')
            .send({
            		status: statuses[index]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('code').and.equal(500);
                res.body.should.have.property('error').and.be.a('string');
                if (config.verbose) console.log("PATCH /api/user response (status):".underline.green ,JSON.stringify(res.body));
                done();
            });
    });
   
    it('tries to patch __v', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.patch('/api/user')
            .send({
            		__v: 'some value'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('code').and.equal(500);
                res.body.should.have.property('error').and.be.a('string');
                if (config.verbose) console.log("PATCH /api/user response (__v):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('tries to patch _id', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.patch('/api/user')
            .send({
            		_id: 'some value'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('code').and.equal(500);
                res.body.should.have.property('error').and.be.a('string');
                if (config.verbose) console.log("PATCH /api/user response (_id):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('tries to patch social_id', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.patch('/api/user')
            .send({
            		social_id: 'some value'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('code').and.equal(500);
                res.body.should.have.property('error').and.be.a('string');
                if (config.verbose) console.log("PATCH /api/user response (social_id):".underline.green , JSON.stringify(res.body));
                done();
            });
    });
    it('tries to patch black_list', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.patch('/api/user')
            .send({
            		black_list: 'some value'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('code').and.equal(500);
                res.body.should.have.property('error').and.be.a('string');
                if (config.verbose) console.log("PATCH /api/user response (black_list):".underline.green , JSON.stringify(res.body));
                done();
            });
    });

});
describe('DELETE /api/user', function () {
    it('deactivates the user', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.del('/api/user')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', commonObj['auth_token'])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.deep.property('result.success').be.true;
                if (config.verbose) console.log("DELETE /api/user response:".underline.green , JSON.stringify(res.body));
                done();
            });
    });
});
    