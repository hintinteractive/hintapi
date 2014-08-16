var colors = require('colors'),
	should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config'),
    api = supertest(config.api_url),
    common = require('./common');

var commonObj = {};
var commonObj2 = {};

var _u1_social_id;
var _u2_social_id;
describe('Authenticate', function () {
    it('login the user and gets hint auth token', common.getAuthToken(commonObj, "auth_token", "userId"));
    it('login the user2 and gets hint auth token', common.getAuthToken2(commonObj2, "auth_token", "userId"));
});

var _c_lat = 23.81205;
var _c_lng = 90.422147;

var _v_social_id ;
var _v_name ;
var _v_address ;

var _flirt_id = [];

var _flirt_id1;
var _flirt_id2;
var _connection_id;

var _event_id;
var _f_event_start, _f_event_expiry;


var _u1_name = 'user1';
var _u2_name = 'user2';
var _u_hair_color = 'dark';
var _u_gender = 'male';
var _u_interested_in = ['male','female'];
var _u_photo = 'http://hint.blob.core.windows.net:80/100000470022763/5eb0fdc0-e29c-11e3-b522-914d4488f996.jpg';
var _u_type = 'belt';
var _u_brand = 'nike';
var _u_color = 'red';

var _start_time = Date.now() / 1000;
var _expiry_time = _start_time +60*60*24;

var _v_cat_image = "https://foursquare.com/img/categories_v2/food/default_bg_32.png";

/*
	Init Social id
*/
describe('Init Social Id', function () {
    it('Init social id', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated user1");
        if(!commonObj2['auth_token']) done("Not Authenticated user2");
        _u1_social_id = commonObj['userId'];
        _u2_social_id = commonObj2['userId'];
        
        console.log(_u2_social_id);
        console.log(_u1_social_id);
        done();
    });
});

/*
	Getting venue
*/
describe('GET /api/venue', function () {
    it('gets a list of nearby venues', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.get('/api/venue')
        	.query({ 
        		lat: _c_lat,
        		lng: _c_lng,
        		radius: 1,
        		limit : 2
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
                res.body.result.should.have.length(2);
                for(var i=0;i<res.body.result.length;i++){
                	res.body.result[i].should.have.property('social_id').and.have.string('Facebook:');
                	res.body.result[i].should.have.property('name');
                	res.body.result[i].should.have.property('address');
                	res.body.result[i].should.have.property('lat').and.be.a('number');
                	res.body.result[i].should.have.property('lng').and.be.a('number');
                	res.body.result[i].should.have.property('distance').and.be.below(1);
                	res.body.result[i].should.have.deep.property('category.flirt_options.simple');
                	res.body.result[i].should.have.deep.property('category.flirt_options.forward');
                	res.body.result[i].should.have.deep.property('category.flirt_options.risky');
                	res.body.result[i].should.have.deep.property('category.image');

                	_v_social_id = res.body.result[i].social_id;
                	_v_name = res.body.result[i].name;
                	_v_address = res.body.result[i].address;
                	
                	//break;
                }
                
                if (config.verbose) console.log("GET /api/venue response :".underline.green, JSON.stringify(res.body));
                console.log(_v_social_id);
               	done();         
            });
    });
});

/*
	First user POST Event
*/
describe('POST /api/event', function () {
	 it('creates an event', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 	api.post('/api/event')
		 	.send({
		 		name : "user1 test event",
		 		description: "test event",
		 		venue: {
		 			social_id: _v_social_id,
		 			name : _v_name,
		 			address : _v_address,
		 			lat : _c_lat,
		 			lng : _c_lng,
		 			category: {
		 				image: _v_cat_image
		 			}
		 		},
			 start : _start_time,
			 expiry : _expiry_time,
			 flirt_options : {
				 simple : "hi",
				 forward : "hi",
				 risky : "hi"
			 },
			 privacy : 'SECRET'
		 })
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.name');
			res.body.should.have.deep.property('result.description');
			res.body.should.have.deep.property('result.start');
			res.body.should.have.deep.property('result.expiry');
			res.body.should.have.deep.property('result.privacy');
			res.body.should.have.deep.property('result.social_id').and.have.string('Facebook');
			res.body.should.have.deep.property('result._id');
			res.body.should.have.deep.property('result.status');
			res.body.should.have.deep.property('result.flirt_options');
			res.body.should.have.deep.property('result.owners').and.be.an.instanceof(Array);
			res.body.should.have.deep.property('result.venue');

			_event_id = res.body.result.social_id;
			_f_event_start = res.body.result.start;
			_f_event_expiry = res.body.result.expiry;

			if (config.verbose) console.log("POST /api/event response:".underline.green ,
					JSON.stringify(res.body));
			done();
		 });
	 });
 });

/*
	First user GET event 
*/
describe('GET /api/event',function() {
	it('get single event',function (done){
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/event')
			.query({
					social_id : _event_id
				})
		       .set('Content-Type', 'application/json')
		       .set('Accept', 'application/json')
		       .set('X-ZUMO-AUTH', commonObj['auth_token'])
		       .expect(200)
		       .expect('Content-Type', /json/)
		       .end(function (err, res) {
		    	   if (err) return done(err);
		    	   
			        res.body.should.have.property('api_access').and.be.true;
			       	//res.body.should.have.property('result').and.be.instanceof(Array);	
					 
		    	    if (config.verbose) console.log("GET GET /api/event for user1:".underline.green, JSON.stringify(res.body));
		    	    done();
		    	    
				});			
	
	});


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
				 if(res.body.result[i].social_id == _event_id){
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

		         	if (config.verbose) console.log("GET /api/event for user1:".underline.green, JSON.stringify(res.body.result[i]));
             		done();
				}
	        
     		}
		});
	});
});	

/*
	First user POST Checkin
*/
describe('POST /api/checkin', function () {
	 it('checkin in a place', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/checkin')
		 .send({
			user:{
				 name : _u1_name,
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
			event: {
				social_id: _event_id,
				title : 'user1 test event',
				start : _f_event_start,
				expiry: _f_event_expiry,
				flirt_options : {
					simple : 'hi',
					forward : 'hi',
					risky : 'hi'
				},
				social_venue : {
					social_id : _v_social_id,
					name : _v_name,
					address : _v_address,
					category: {
						image : _v_cat_image
					}
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
			 	res.body.result.should.have.deep.property('user.social_id').and.have.string('Facebook:');
				res.body.result.should.have.deep.property('user.name');
				res.body.result.should.have.deep.property('user.hair_color');
				res.body.result.should.have.deep.property('user.gender'); 
				res.body.result.should.have.deep.property('user.interested_in').and.be.an.instanceof(Array);
				res.body.result.should.have.deep.property('user.current_look.photo_url');
				res.body.result.should.have.deep.property('user.current_look.identifier.type');
				res.body.result.should.have.deep.property('user.current_look.identifier.brand');
				res.body.result.should.have.deep.property('user.current_look.identifier.color');
				res.body.result.should.have.deep.property('social_venue')
				res.body.result.should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');					
				res.body.result.should.have.deep.property('social_venue.name');
				res.body.result.should.have.deep.property('social_venue.address');
				
				res.body.result.should.have.deep.property('flirt_options.simple');
				res.body.result.should.have.deep.property('flirt_options.forward');
				res.body.result.should.have.deep.property('flirt_options.risky');
				res.body.result.should.have.deep.property('time');
				res.body.result.should.have.deep.property('expiry');
				
				res.body.result.should.have.deep.property('flirts').and.be.an.instanceof(Array);
				res.body.result.should.have.deep.property('hints').and.be.an.instanceof(Array);

			 if (config.verbose) console.log("POST /api/checkin response for user1:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		 });
	 });
});

/*
	Second user Post Hint
*/
describe('POST /api/checkin', function () {
	 it('checkin in a place', function (done) {
		 if (!commonObj2['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/checkin')
		 .send({
			 user:{
				 name : _u2_name,
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
				 category: {
					 flirt_options : {
						 simple : "hi",
						 forward : "hi",
						 risky : "hi"
					 },
					 image : _v_cat_image
				 }
			 }
		 })
		 .set('Content-Type', 'application/json')
		 .set('Accept', 'application/json')
		 .set('X-ZUMO-AUTH', commonObj2['auth_token'])
		 .expect(200)
		 .expect('Content-Type', /json/)
		 .end(function (err, res) {
			 if (err) return done(err);

			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			res.body.result.should.have.deep.property('user.social_id').and.have.string('Facebook:');
			res.body.result.should.have.deep.property('user.name');
			res.body.result.should.have.deep.property('user.hair_color');
			res.body.result.should.have.deep.property('user.gender'); 
			res.body.result.should.have.deep.property('user.interested_in').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('user.current_look');
			res.body.result.should.have.deep.property('social_venue')
			res.body.result.should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');					
			res.body.result.should.have.deep.property('social_venue.name');
			res.body.result.should.have.deep.property('social_venue.address');
			res.body.result.should.have.deep.property('flirt_options');
			res.body.result.should.have.deep.property('time');
			res.body.result.should.have.deep.property('expiry');
			res.body.result.should.have.deep.property('flirts').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('hints').and.be.an.instanceof(Array);

			 if (config.verbose) console.log("POST /api/checkin response for user2:".underline.green ,
					 JSON.stringify(res.body));
			 done();
		 });
	 });
});

/*
	First user POST Flirt
*/
describe('POST /api/flirt', function () {
	 it('post flirt', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/flirt')
		 .send({
			checkin : {
     		   id: _v_social_id
  			},
			user_from:{
				name : _u1_name,
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
				social_id: _u2_social_id,
				name : _u2_name,
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
				 
			},
			flirt_options: {
				type : 'simple',
				text : 'hi'
			}
		 })
		 .set('Content-Type', 'application/json')
		 .set('Accept', 'application/json')
		 .set('X-ZUMO-AUTH', commonObj['auth_token'])
		 .expect(200)
		 .expect('Content-Type', /json/)
		 .end(function (err, res) {
			if (err){
				//console.log(res);
			return done(err)};
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('checkin.id');
			res.body.result.should.have.deep.property('user_from');
			res.body.result.should.have.deep.property('user_to');
			res.body.result.should.have.deep.property('social_venue');
			res.body.result.should.have.deep.property('flirt_options');
			res.body.result.should.have.deep.property('status');		
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');
			
			_flirt_id1 = res.body.result._id;

			if (config.verbose) console.log("POST /api/flirt response user1 :".underline.green ,
					JSON.stringify(res.body));
			 done();
		 });
	 });

	it('post flirt', function (done) {
		 if (!commonObj['auth_token']) done("Not Authenticated");
		        
		 api.post('/api/flirt')
		 .send({
			checkin : {
     		   id: _v_social_id
  			},
			user_from:{
				name : _u1_name,
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
				social_id: _u2_social_id,
				name : _u2_name,
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
				 
			},
			flirt_options: {
				type : 'simple',
				text : 'hi'
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
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('checkin.id');
			res.body.result.should.have.deep.property('user_from');
			res.body.result.should.have.deep.property('user_to');
			res.body.result.should.have.deep.property('social_venue');
			res.body.result.should.have.deep.property('flirt_options');
			res.body.result.should.have.deep.property('status');		
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');

			_flirt_id2 = res.body.result._id;

			if (config.verbose) console.log("POST /api/flirt response user1 :".underline.green ,
					JSON.stringify(res.body));
			 done();
		 });
	 });
});

/*
	First user GET Flirt
*/
describe('GET /api/flirt',function() {
	
	it('get flirts',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/flirt')
		.query({
			'status' : 'sent'
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

				if(res.body.result[i]._id == _flirt_id1 | res.body.result[i]._id == _flirt_id2){
					res.body.result[i].should.have.deep.property('_id');
					res.body.result[i].should.have.deep.property('checkin.id');
					
					//res.body.result[i].should.have.deep.property('user_from._id');
					res.body.result[i].should.have.deep.property('user_from.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('user_from.name');
					res.body.result[i].should.have.deep.property('user_from.hair_color');
					res.body.result[i].should.have.deep.property('user_from.gender');
					res.body.result[i].should.have.deep.property('user_from.interested_in').and.be.an.instanceof(Array);
					res.body.result[i].should.have.deep.property('user_from.current_look');
					//res.body.result[i].should.have.deep.property('user_from.current_look.identifier');
					// res.body.result[i].should.have.deep.property('user_from.current_look.identifier.type');
					// res.body.result[i].should.have.deep.property('user_from.current_look.identifier.brand');
					// res.body.result[i].should.have.deep.property('user_from.current_look.identifier.color');

					res.body.result[i].should.have.deep.property('user_to.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('user_to.name');
					res.body.result[i].should.have.deep.property('user_to.hair_color');
					res.body.result[i].should.have.deep.property('user_to.gender');
					res.body.result[i].should.have.deep.property('user_to.interested_in').and.be.an.instanceof(Array);

					res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('social_venue.name');
					res.body.result[i].should.have.deep.property('social_venue.address');
					

					res.body.result[i].should.have.deep.property('flirt_options');
					//res.body.result[i].should.have.deep.property('flirt_options.text');

					res.body.result[i].should.have.deep.property('status');		
					res.body.result[i].should.have.deep.property('time');	
					res.body.result[i].should.have.deep.property('expiry');

					if (config.verbose) console.log("GET /api/flirt response for user1:".underline.green, JSON.stringify(res.body.result[i]));
					
				}
							
			}
			done();	 
		});
	});
});

/*
	Second user GET flirt
*/
describe('GET /api/flirt',function() {
	
	it('get flirts',function (done) {
		if (!commonObj2['auth_token']) done("Not Authenticated");
		
		api.get('/api/flirt')
		.query({
			'status' : 'sent'
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj2['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.property('result').and.be.an.instanceof(Array);
			
			for(var i=0,j=0 ;i<res.body.result.length;i++){
				if(res.body.result[i]._id == _flirt_id1 | res.body.result[i]._id == _flirt_id2){
					res.body.result[i].should.have.deep.property('_id');
					res.body.result[i].should.have.deep.property('checkin.id');
					
					res.body.result[i].should.have.deep.property('user_from.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('user_from.name');
					res.body.result[i].should.have.deep.property('user_from.hair_color');
					res.body.result[i].should.have.deep.property('user_from.gender');
					res.body.result[i].should.have.deep.property('user_from.interested_in').and.be.an.instanceof(Array);
					res.body.result[i].should.have.deep.property('user_from.current_look');

					res.body.result[i].should.have.deep.property('user_to.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('user_to.name');
					res.body.result[i].should.have.deep.property('user_to.hair_color');
					res.body.result[i].should.have.deep.property('user_to.gender');
					res.body.result[i].should.have.deep.property('user_to.interested_in').and.be.an.instanceof(Array);

					res.body.result[i].should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
					res.body.result[i].should.have.deep.property('social_venue.name');
					res.body.result[i].should.have.deep.property('social_venue.address');
					
					res.body.result[i].should.have.deep.property('flirt_options');
					res.body.result[i].should.have.deep.property('status');		
					res.body.result[i].should.have.deep.property('time');	
					res.body.result[i].should.have.deep.property('expiry');	
					if (config.verbose) console.log("GET /api/flirt response for user2:".underline.green, JSON.stringify(res.body.result[i]));
					
				}			
			}
			done();
		});
	});
});

/*
	Second user PATCH Flirt
*/
describe('PATCH /api/flirt',function() {
	
	it('patch flirts accept',function (done) {
		if (!commonObj2['auth_token']) done("Not Authenticated");
		
		api.patch('/api/flirt')
		.query({
			id : _flirt_id1
		})
		.send({
			action : 'accept'
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj2['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			res.body.should.have.deep.property('result._id');
			res.body.should.have.deep.property('result.expiry');
			res.body.should.have.deep.property('result.status');
			res.body.should.have.deep.property('result.time');
			res.body.should.have.deep.property('result.flirt_options');
			res.body.should.have.deep.property('result.social_venue');
			res.body.should.have.deep.property('result.user_to');
			res.body.should.have.deep.property('result.user_from');
			res.body.should.have.deep.property('result.checkin');
			res.body.should.have.deep.property('result.connection');
			
			_connection_id = res.body.result.connection._id;

			if (config.verbose) console.log("PATCH /api/flirt response for user2:".underline.green, JSON.stringify(res.body));
			done();
				 
		});
	});	
	
	it('patch flirts reject',function (done) {
		if (!commonObj2['auth_token']) done("Not Authenticated");
		
		api.patch('/api/flirt')
		.query({
			id : _flirt_id2
		})
		.send({
			action : 'reject'
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', 	['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			
			if (config.verbose) console.log("PATCH /api/flirt response for user2:".underline.green, JSON.stringify(res.body));
			done();
				 
		});
		
	});
});

/*
	First user PATCH connection
*/
describe('PATCH /api/connection',function() {
	
	it('patch connection',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.patch('/api/connection')
		.query({
			id : _connection_id
		})
		.send({
			message : {
    	  	  text: 'user 1 say hi'
    		}
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj['auth_token'])
		.expect(200)
		//.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			res.body.result.should.have.property('users').and.be.an.instanceof(Array);
			res.body.result.should.have.property('messages').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
			res.body.result.should.have.deep.property('social_venue.name');
			res.body.result.should.have.deep.property('social_venue.address');
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('keep_alive.flag');
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');
			
			if (config.verbose) console.log("PATCH /api/connection response for user1:".underline.green, JSON.stringify(res.body));
			done();
				 
		});
	});
});

/*
	Second user PATCH Connection
*/
describe('PATCH /api/connection',function() {
	
	it('patch connection',function (done) {
		if (!commonObj2['auth_token']) done("Not Authenticated");
		
		api.patch('/api/connection')
		.query({
			id : _connection_id
		})
		.send({
			message : {
    	  	  text: 'user 2 say hi'
    		}
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj2['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
		
			res.body.should.have.property('api_access').and.be.true;
			res.body.should.have.deep.property('result.success').and.be.true;
			res.body.result.should.have.property('users').and.be.an.instanceof(Array);
			res.body.result.should.have.property('messages').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('social_venue.social_id').and.have.string('Facebook:');
			res.body.result.should.have.deep.property('social_venue.name');
			res.body.result.should.have.deep.property('social_venue.address');
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('keep_alive.flag');
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');

			
			if (config.verbose) console.log("PATCH /api/connection response for user2:".underline.green, JSON.stringify(res.body));
			done();
				 
		});
	});
});

/*
	First user GET Single connection
*/
describe('GET /api/connection',function() {
	
	it('get connection',function (done) {
		if (!commonObj['auth_token']) done("Not Authenticated");
		
		api.get('/api/connection')
		.query({
			id: _connection_id
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			
			res.body.should.have.property('api_access').and.be.true;
			res.body.result.should.have.property('users').and.be.an.instanceof(Array);
			res.body.result.should.have.property('messages').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('social_venue');
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('keep_alive.flag');
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');

			if (config.verbose) console.log("GET /api/connection response for user1:".underline.green, JSON.stringify(res.body));
			done();	
			
		});
	});
});

/*
	Second user GET Single Connection
*/
describe('GET /api/connection',function() {
	
	it('get connection',function (done) {
		if (!commonObj2['auth_token']) done("Not Authenticated");
		
		api.get('/api/connection')
		.query({
			id: _connection_id
		})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('X-ZUMO-AUTH', commonObj2['auth_token'])
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			
			res.body.should.have.property('api_access').and.be.true;
			res.body.result.should.have.property('users').and.be.an.instanceof(Array);
			res.body.result.should.have.property('messages').and.be.an.instanceof(Array);
			res.body.result.should.have.deep.property('social_venue');
			res.body.result.should.have.deep.property('_id');
			res.body.result.should.have.deep.property('keep_alive.flag');
			res.body.result.should.have.deep.property('time');	
			res.body.result.should.have.deep.property('expiry');	
		
			if (config.verbose) console.log("GET /api/connection response for user2:".underline.green, JSON.stringify(res.body));
			done();	
		});
	});
});