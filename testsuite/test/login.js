var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('https://hint.azure-mobile.net'),
    config = require('../config');
var hint_auth_token  = null;

describe('Authenticate', function() {
  it('gets hint auth token', function(done) {
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

