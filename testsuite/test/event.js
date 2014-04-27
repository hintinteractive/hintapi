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
var _v_social_id= "Facebook:24507996273";
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
            if (config.verbose) console.log("POST /api/event response:".underline.green , JSON.stringify(res.body));
            done();
        });
    });

});



    