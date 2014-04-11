var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('https://hint.azure-mobile.net'),
    config = require('../config');
var hint_auth_token = null;

describe('Authenticate', function () {
    it('login the user and gets hint auth token', function (done) {
        api.post('/login/facebook')
            .send({
                access_token: config.facebook_access_token
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.deep.property('user.userId')
                    .and.have.string('Facebook:');
                res.body.should.have.property('authenticationToken');
                hint_auth_token = res.body.authenticationToken;
                if (config.verbose) console.log("Hint Access Token : " + hint_auth_token);
                done();
            });
    });

});

describe('GET /api/venue', function () {
    it('gets a list of nearby venues', function (done) {
        if (!hint_auth_token) done("Not Authenticated");
        api.get('/api/venue')
        	.query({ 
        		lat: 37.78583526611328,
        		lng: -122.40641784667969,
        		radius: 1
        	})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-ZUMO-AUTH', hint_auth_token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('api_access').and.be.true;
                res.body.should.have.property('result').and.be.an.instanceof(Array);
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
                
                if (config.verbose) console.log("GET /api/user response : " + JSON.stringify(res.body));
                done();
            });
    });

});



    