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
var _name = "my test event";
var _desc = "my test event desc";
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
var _privacy = 'SECRET';
 describe('POST /api/event', function () {
	 it('creates an event', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 	api.post('/api/event')
		 	.send({
		 		name : _name,
		 		description: _desc,
		 		venue: {
		 			social_id: _v_social_id,
		 			name : _v_name,
		 			address : _v_address,
		 			lat : _v_lat,
		 			lng : _v_lng,
		 			category: {
		 				image: _v_cat_image
		 			}
		 		},
			 start : _start,
			 expiry : _expiry,
			 flirt_options : {
				 simple : _s_flirt,
				 forward : _f_flirt,
				 risky : _r_flirt
			 },
			 privacy : _privacy
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
			 if (config.verbose) console.log("POST /api/event response:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		 });
	 });

 });


describe('GET /api/event',function() {
	it('get all event',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/event')
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
				 res.body.result[i].should.have.deep.property('social_id').and.have.string('Facebook:');
				 res.body.result[i].should.have.deep.property('name');
				 res.body.result[i].should.have.deep.property('description');
				 res.body.result[i].should.have.deep.property('start');
				 res.body.result[i].should.have.deep.property('expiry');
				 res.body.result[i].should.have.deep.property('venue.social_id').and.have.string('Facebook:');
				 res.body.result[i].should.have.deep.property('venue.address');
				 res.body.result[i].should.have.deep.property('venue.name');
				 res.body.result[i].should.have.deep.property('venue.category.image');
				 res.body.result[i].should.have.deep.property('flirt_options');
				 res.body.result[i].should.have.deep.property('flirt_options.simple');
	         	 res.body.result[i].should.have.deep.property('flirt_options.forward');
	         	 res.body.result[i].should.have.deep.property('flirt_options.risky');
	         	 
	         	 res.body.result[i].should.have.deep.property('owners').and.be.an.instanceof(Array);
	         	 for(var j=0;j<res.body.result[i].owners.length;j++){
	         		 res.body.result[i].owners[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
	         		 res.body.result[i].owners[j].should.have.deep.property('user._id');
	         	 }
	        
	         	
			 }
			 if (config.verbose) console.log("GET GET /api/event :".underline.green, JSON.stringify(res.body));
             done();
			 
		 });
		
	});
	
	it('get single event',function (done){
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:1541120406115331';	
		api.get('/api/event')
				.query({
					social_id : _social_id
				})
		       .set('Content-Type', 'application/json')
		       .set('Accept', 'application/json')
		       .set('X-ZUMO-AUTH', commonObj['auth_token'])
		       .expect(200)
		       .expect('Content-Type', /json/)
		       .end(function (err, res) {
		    	   if (err) return done(err);
		    	   res.body.should.have.property('api_access').and.be.true;
					 
		    	   res.body.should.have.deep.property('result.social_id').and.have.string('Facebook:');
		    	   res.body.should.have.deep.property('result._id');
		    	   res.body.should.have.deep.property('result.name');
		    	   res.body.should.have.deep.property('result.description');
		    	   res.body.should.have.deep.property('result.start');
		    	   res.body.should.have.deep.property('result.expiry');
		    	   res.body.should.have.deep.property('result.status');
		    	   res.body.should.have.deep.property('result.venue.social_id').and.have.string('Facebook:');
		    	   res.body.should.have.deep.property('result.venue.address');
		    	   res.body.should.have.deep.property('result.venue.name');
		    	   res.body.should.have.deep.property('result.venue.category.image');
		    	   res.body.should.have.deep.property('result.flirt_options');
		    	   res.body.should.have.deep.property('result.flirt_options.simple');
		    	   res.body.should.have.deep.property('result.flirt_options.forward');
		    	   res.body.should.have.deep.property('result.flirt_options.risky');
			         	 
		    	   res.body.should.have.deep.property('result.owners').and.be.an.instanceof(Array);
		    	   for(var j=0;j<res.body.result.owners.length;j++){
		    		   res.body.result.owners[j].should.have.deep.property('user.social_id').and.have.string('Facebook:');
		    		   res.body.result.owners[j].should.have.deep.property('user._id');
		    	   } 
			        
			         	
					 
		    	   if (config.verbose) console.log("GET GET /api/event :".underline.green, JSON.stringify(res.body));
		    	   done();
					 
				 });
	
	});
});

describe('GET /api/event/friend',function() {
	it('get friend list',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:1541120406115331';
		api.get('/api/event/friend')
		.query({
					social_id : _social_id
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
						res.body.result[i].should.have.deep.property('social_id').and.have.string('Facebook:');
						res.body.result[i].should.have.deep.property('name');
						res.body.result[i].should.have.deep.property('image');
					}    	
				 
				 if (config.verbose) console.log("GET /api/event/friend :".underline.green, JSON.stringify(res.body));
	             done();
				 
			 });
		
	});
	
	
});

describe('POST /api/event/friend',function() {
	it('get friend list',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:294747040690002';
		api.post('/api/event/friend')
		.send({
					social_id : _social_id,
					friends: ['Facebook:100000470022763']
				})
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('X-ZUMO-AUTH', commonObj['auth_token'])
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					res.body.should.have.property('api_access').and.be.true;
					res.body.should.have.property('result').and.be.true;
				// res.body.should.have.property('result.success');
				 
				 if (config.verbose) console.log("POST /api/event/friend :".underline.green, JSON.stringify(res.body));
	             done();
				 
			 });
		
	});
	
	
});

 describe('POST /api/event/rsvp',function() {
	 it('post event rsvp',function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		 var _social_id = 'Facebook:294747040690002';
		
		 api.post('/api/event/rsvp')
		 .send({
			 social_id : _social_id,
			 rsvp: 'attending'
		 })
		 .set('Content-Type', 'application/json')
		 .set('Accept', 'application/json')
		 .set('X-ZUMO-AUTH', commonObj['auth_token'])
		 .expect(200)
		 .expect('Content-Type', /json/)
		 .end(function (err, res) {
				 if (err) return done(err);
				 res.body.should.have.property('api_access').and.be.true;
				 // res.body.should.have.property('result').and.be.true;
				 // res.body.should.have.property('result.success');
							 
				 if (config.verbose) console.log("POST /api/event/rsvp :".underline.green,
						 JSON.stringify(res.body));
				 done();
						 
		 });
			
	 });
	
	
 });

describe('PATCH /api/event',function() {
	it('patch name',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:294747040690002';
		var _id ='537f6dff7dda295410b23e4b';
		
		api.patch('/api/event')
		.send({
					social_id : _social_id,
					name: _name,
					start: _start
				})
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('X-ZUMO-AUTH', commonObj['auth_token'])
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					res.body.should.have.property('api_access').and.be.true;
					
				 
					if (config.verbose) console.log("PATCH /api/event :".underline.green, JSON.stringify(res.body));
					done();
				 
				});
		
	});
	
	it('patch flirts',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:1541120406115331';
		
		api.patch('/api/event')
		.query({
			id : '53769462b41897b8217c74ed'
		})
		.send({
					social_id : _social_id,
					//start : _start,
					flirt_options : {
						simple : 'update1',
						forward : 'update2',
						risky : 'update3'
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
					
				 
					if (config.verbose) console.log("PATCH /api/event :".underline.green, JSON.stringify(res.body));
					done();
				 
				});
		
	});
	
	
});


describe('DELETE /api/event',function() {
	it('delete event',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		var _social_id = 'Facebook:294747040690002';
		
		api.del('/api/event')
			.query({
				social_id : _social_id
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('X-ZUMO-AUTH', commonObj['auth_token'])
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				if (err) return done(err);
				res.body.should.have.property('api_access').and.be.true;
				res.body.should.have.property('result.success').and.be.true;
				
				if (config.verbose) console.log("DELETE /api/event :".underline.green,
						JSON.stringify(res.body));
				done();
			
			});
		
});
	
	
});
    
