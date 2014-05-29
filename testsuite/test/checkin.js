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

var _u_name = 'test name';
var _u_hair_color = 'dark';
var _u_gender = 'male';
var _u_interested_in = ['male','female'];
var _u_type = 'belt';
var _u_brand = 'nike';
var _u_color = 'red';
var _v_social_id= "Facebook:294747040690002";
var _v_name = "Be what's possible";
var _v_address = "2 folsom st., San Francisco, CA, United States";
var _v_lat = 37.790862;
var _v_lng = -122.391026;
var _v_cat_image = "https://foursquare.com/img/categories_v2/food/default_bg_32.png";
var _start =Date.now() /1000;
var _expiry = _start +60*60*24;
var _s_flirt = 'Hey1';
var _f_flirt = 'Hey2';
var _r_flirt = 'Hey3';
var _e_soicial_id = 'Facebook:294747040690002';
var _e_name = 'hello';
var _e_start = Date.now() /1000;

describe('POST /api/checkin', function () {
	 it('checkin in a place', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/checkin')
		 .send({
			 user:{
				 name : _u_name,
				 hair_color : _u_hair_color,
				 gender : _u_gender,
				 interested_in : _u_interested_in,
				 current_look : {
					 photo_url : null,
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
				 category: {
					 flirt_options : {
						 simple : _s_flirt,
						 forward : _f_flirt,
						 risky : _r_flirt
					 },
					 image : _v_cat_image
				 }
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
			 if (config.verbose) console.log("POST /api/checkin response:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		 });
	 });
	 
	 

});

describe('GET /api/checkin',function() {
	it('get chekin',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/checkin')
		.query({
			social_venue_id : _v_social_id
		})
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
				res.body.result[i].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('user.name');
				res.body.result[i].should.have.deep.property('user.hair_color');
				res.body.result[i].should.have.deep.property('user.gender'); 
				res.body.result[i].should.have.deep.property('user.interested_in').and.be.an.instanceof(Array);
				res.body.result[i].should.have.deep.property('user.current_look.photo_url');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.type');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.brand');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.color');
				
				res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('social_venue.name');
				res.body.result[i].should.have.deep.property('social_venue.address');
				
				res.body.result[i].should.have.deep.property('flirt_options.simple');
				res.body.result[i].should.have.deep.property('flirt_options.forward');
				res.body.result[i].should.have.deep.property('flirt_options.risky');
				
				res.body.result[i].should.have.deep.property('time');
				res.body.result[i].should.have.deep.property('expiry');
				// res.body.result[i].should.have.deep.property('event.social_id').and.have.string('Facebook:');
				
				res.body.result[i].should.have.deep.property('flirts').and.be.an.instanceof(Array);
				for(var j=0; j<res.body.result[i].flirts.length;j++){
					res.body.result.flirts[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				}
				
				res.body.result[i].should.have.deep.property('hints').and.be.an.instanceof(Array);
				for(var j=0; j<res.body.result[i].hints.length;j++){
					res.body.result.flirts[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				}
			}	 
			if (config.verbose) console.log("GET /api/checkin response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
	
	
	
});

describe('POST /api/checkin', function () {
	it('checkin in a place using event', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/checkin')
		 .send({
			 user:{
				 name : _u_name,
				 hair_color : _u_hair_color,
				 gender : _u_gender,
				 interested_in : _u_interested_in,
				 current_look : {
					 photo_url : null,
					 identifier: {
						 type : _u_type,
						 brand : _u_brand,
						 color : _u_color
					 }
				 }
			 },
			 event : {
				 social_id: _e_soicial_id,
				 name : _e_name,
				 social_venue: {
					 social_id: _v_social_id,
					 name : _v_name,
					 address : _v_address,
					 category: {
						 image : _v_cat_image 
					 }
				 },
				 start : _e_start,
				 flirt_options : {
					 simple : _s_flirt,
					 forward : _f_flirt,
					 risky : _r_flirt
				 }
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
			 if (config.verbose) console.log("POST /api/checkin response:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		 });
	 });
});


describe('GET /api/checkin',function() {
	it('get chekin event',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/checkin')
		.query({
			social_venue_id : _v_social_id
		})
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
				res.body.result[i].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('user.name');
				res.body.result[i].should.have.deep.property('user.hair_color');
				res.body.result[i].should.have.deep.property('user.gender'); 
				res.body.result[i].should.have.deep.property('user.interested_in').and.be.an.instanceof(Array);
				res.body.result[i].should.have.deep.property('user.current_look.photo_url');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.type');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.brand');
				res.body.result[i].should.have.deep.property('user.current_look.identifier.color');
				
				res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
				res.body.result[i].should.have.deep.property('social_venue.name');
				res.body.result[i].should.have.deep.property('social_venue.address');
				
				res.body.result[i].should.have.deep.property('flirt_options.simple');
				res.body.result[i].should.have.deep.property('flirt_options.forward');
				res.body.result[i].should.have.deep.property('flirt_options.risky');
				
				res.body.result[i].should.have.deep.property('time');
				res.body.result[i].should.have.deep.property('event.social_id').and.have.string('Facebook:');
				
				res.body.result[i].should.have.deep.property('flirts').and.be.an.instanceof(Array);
				for(var j=0; j<res.body.result[i].flirts.length;j++){
					res.body.result.flirts[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				}
				
				res.body.result[i].should.have.deep.property('hints').and.be.an.instanceof(Array);
				for(var j=0; j<res.body.result[i].hints.length;j++){
					res.body.result.flirts[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
				}
			}	 
			if (config.verbose) console.log("GET /api/checkin response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
});

describe('GET /api/checkin/clothing',function() {
	
	it('get chekin clothing',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/checkin/clothing')
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.items').and.be.an.instanceof(Array);
			for(var i=0;i<res.body.result.items.length;i++){
				res.body.result.items[i].should.have.deep.property('_id');
				res.body.result.items[i].should.have.deep.property('name');
			}	 
			
			res.body.should.have.deep.property('result.brands').and.be.an.instanceof(Array);
			for(var i=0;i<res.body.result.brands.length;i++){
				res.body.result.brands[i].should.have.deep.property('_id');
				res.body.result.brands[i].should.have.deep.property('name');
			}
			
			if (config.verbose) console.log("GET /api/checkin/clothing response :".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
	
});

