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

describe('GET /api/venue', function () {
    it('gets a list of nearby venues', function (done) {
        if (!commonObj['auth_token']) done("Not Authenticated");
        api.get('/api/venue')
        	.query({ 
        		lat: 37.78583526611328,
        		lng: -122.40641784667969,
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
                }
                
                if (config.verbose) console.log("GET /api/venue response :".underline.green, JSON.stringify(res.body));
                done();
            });
    });

});



    