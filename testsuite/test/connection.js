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

var _id = '537693e5b41897b8217c74db';

describe('GET /api/connection',function() {
	
	it('get connection',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/connection')
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.property('result').and.be.an.instanceof(Array);
			
			for(var i=0;i<res.body.result.length;i++){
				
				res.body.result[i].should.have.property('users').and.be.an.instanceof(Array);
				for(var j=0;j<res.body.result[i].users.length;j++){
					res.body.result[i].should.have.deep.property('_id');

					res.body.result[i].users[j].should.have.deep.property('social_id').and.have.string('Facebook:');
					res.body.result[i].users[j].should.have.deep.property('name');
					res.body.result[i].users[j].should.have.deep.property('hair_color');
					res.body.result[i].users[j].should.have.deep.property('gender');
					res.body.result[i].users[j].should.have.deep.property('interested_in').and.be.an.instanceof(Array);
					res.body.result[i].users[j].should.have.deep.property('current_look.photo_url');
					//res.body.result[i].users[j].should.have.deep.property('current_look.identifier');
				}
				
				res.body.result[i].should.have.property('messages').and.be.an.instanceof(Array);
				for(var j=0;j<res.body.result[i].messages.length;j++){
					res.body.result[i].messages[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
					res.body.result[i].messages[j].should.have.deep.property('text');
					res.body.result[i].messages[j].should.have.deep.property('time');
				}

				res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('social_venue.name');
				res.body.result[i].should.have.deep.property('social_venue.address');

				res.body.result[i].should.have.deep.property('keep_alive.flag');
				
				res.body.result[i].should.have.deep.property('time');	
				res.body.result[i].should.have.deep.property('expiry');							
			}
			
			if (config.verbose) console.log("GET /api/connection response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
	
});

describe('PATCH /api/connection',function() {
	
	it('patch connection',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.patch('/api/connection')
		.query({
			id : _id
		})
		.send({
			message : {
    	  	  text: 'test'
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
			res.body.should.have.deep.property('result.success').and.be.true;
			
			if (config.verbose) console.log("PATCH /api/connection response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
	
});