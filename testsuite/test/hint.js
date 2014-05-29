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

var _u_to_socail_id = 'Facebook:100007978092636';
var _u_name = 'test name';
var _u_hair_color = 'dark';
var _u_gender = 'male';
var _u_interested_in = ['male','female'];
var _u_photo = 'http://hint.blob.core.windows.net:80/100000470022763/5eb0fdc0-e29c-11e3-b522-914d4488f996.jpg';
var _u_type = 'belt';
var _u_brand = 'nike';
var _u_color = 'red';
var _v_social_id= "Facebook:294747040690002";
var _v_name = "Be what's possible";
var _v_address = "2 folsom st., San Francisco, CA, United States";
var _c_id  = '538739254b109c28119679bd';

describe('POST /api/hint', function () {
	 it('post hint', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		api.post('/api/hint')
		.send({
			checkin : {
     		   id: _v_social_id
  			},
			user_from:{
				name : _u_name,
				hair_color : _u_hair_color,
				gender : _u_gender,
				interested_in : _u_interested_in,
				current_look : {
					photo_url : _u_photo,
					identifier: {
						type : _u_type,
						brand : _u_brand,
						color : _u_color
					}
				}
			},
			user_to:{
				social_id: _u_to_socail_id,
				name : _u_name,
				hair_color : _u_hair_color,
				gender : _u_gender,
				interested_in : _u_interested_in,
				current_look : {
					photo_url : _u_photo,
					identifier: {
						type : _u_type,
						brand : _u_brand,
						color : _u_color
					}
				}
			},
			social_venue : {
				social_id : _v_social_id,
				name : _v_name,
				address : _v_address,
				 
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

			 if (config.verbose) console.log("POST /api/hint response:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		});
	});
});


describe('GET /api/hint',function() {
	
	it('get hint',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/hint')
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
				res.body.result[i].should.have.deep.property('_id');
				res.body.result[i].should.have.deep.property('checkin.id').and.have.string('Facebook:');

				res.body.result[i].should.have.deep.property('user_from.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('user_from.name');
				res.body.result[i].should.have.deep.property('user_from.hair_color');
				res.body.result[i].should.have.deep.property('user_from.gender');
				res.body.result[i].should.have.deep.property('user_from.interested_in').and.be.an.instanceof(Array);
				res.body.result[i].should.have.deep.property('user_from.current_look.photo_url');
				

				res.body.result[i].should.have.deep.property('user_to.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('user_to.name');
				res.body.result[i].should.have.deep.property('user_to.hair_color');
				res.body.result[i].should.have.deep.property('user_to.gender');
				res.body.result[i].should.have.deep.property('user_to.interested_in').and.be.an.instanceof(Array);
				res.body.result[i].should.have.deep.property('user_from.current_look.photo_url');

				res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('social_venue.name');
				res.body.result[i].should.have.deep.property('social_venue.address');
				
				res.body.result[i].should.have.deep.property('status');		
				res.body.result[i].should.have.deep.property('time');	
				res.body.result[i].should.have.deep.property('expiry');	
								
			}
			
			if (config.verbose) console.log("GET /api/hint response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
	
});