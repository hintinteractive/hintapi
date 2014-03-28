var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('https://hint.azure-mobile.net'),
    config = require('../config');
var hint_auth_token  = null;

describe('Authenticate', function() {
  it('login the user and gets hint auth token', function(done) {
    api.post('/login/facebook')
	.send({
    		access_token : config.facebook_access_token
	})
    .set('Content-Type', 'application/json')
    .set('Accept','application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.deep.property('user.userId')
	.and.have.string('Facebook:');
      res.body.should.have.property('authenticationToken');
      hint_auth_token = res.body.authenticationToken;
      if(config.verbose) console.log("Hint Access Token : " + hint_auth_token);
      done();
    });
  });

});

describe('GET /api/user', function() {
  it('gets the user info', function(done) {
    if(!hint_auth_token) done("Not Authenticated");
    api.get('/api/user')
    .set('Content-Type', 'application/json')
    .set('Accept','application/json')
    .set('X-ZUMO-AUTH',hint_auth_token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
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
	['light','dark','undefined'].should.include(res.body.result.hair_color);
	res.body.should.have.deep.property('result.gender');
	['male','female','other', 'undefined'].should.include(res.body.result.gender);
	res.body.should.have.deep.property('result.interested_in')
		 .and.be.an.instanceof(Array);
	res.body.should.have.deep.property('result.status');
	['admin','active','inactive','banned','debug'].should.include(res.body.result.status);
	res.body.should.have.deep.property('result.photo_url');
	res.body.should.have.deep.property('result.black_list')
		.and.be.an.instanceof(Array);
      if(config.verbose) console.log("GET /api/user response : " + JSON.stringify(res.body));
      done();
    });
  });

});


describe('PATCH /api/user', function() {
  it('patches the name', function(done) {
    if(!hint_auth_token) done("Not Authenticated");
    var newName = 'Test Name'+ Date.now();
    api.patch('/api/user')
    .send({
           name : newName
     })
    .set('Content-Type', 'application/json')
    .set('Accept','application/json')
    .set('X-ZUMO-AUTH',hint_auth_token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('api_access').and.be.true;
      res.body.should.have.deep.property('result.name').and.equal(newName);
      if(config.verbose) console.log("PATCH /api/user response (name): " + JSON.stringify(res.body));
      done();
    });
  });
 it('patches the email', function(done) {
    if(!hint_auth_token) done("Not Authenticated");
    var newValue = Date.now()+'@hintinteractive.com';
    api.patch('/api/user')
    .send({
           contact : {email: newValue}
     })
    .set('Content-Type', 'application/json')
    .set('Accept','application/json')
    .set('X-ZUMO-AUTH',hint_auth_token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('api_access').and.be.true;
      res.body.should.have.deep.property('result.contact.email').and.equal(newValue);
      res.body.should.have.deep.property('result.contact.phone');
      if(config.verbose) console.log("PATCH /api/user response (name): " + JSON.stringify(res.body));
      done();
    });
  });
  it('patches the phone', function(done) {
    if(!hint_auth_token) done("Not Authenticated");
    var newValue = '+1-'+Date.now();
    api.patch('/api/user')
    .send({
           contact : {phone: newValue}
     })
    .set('Content-Type', 'application/json')
    .set('Accept','application/json')
    .set('X-ZUMO-AUTH',hint_auth_token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('api_access').and.be.true;
      res.body.should.have.deep.property('result.contact.phone').and.equal(newValue);
      res.body.should.have.deep.property('result.contact.email');
      if(config.verbose) console.log("PATCH /api/user response (name): " + JSON.stringify(res.body));
      done();
    });
  });

});
