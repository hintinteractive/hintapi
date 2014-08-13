var colors = require('colors'),
	should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config'),
    api = supertest(config.api_url);
exports.getAuthToken = function(obj, property, userId ,printAuthToken){
	return function (done) {
        api.post('/api/login/facebook')
            .send({
                access_token: config.facebook_access_token,
                device:'test-computer'
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
                obj[property] = res.body.authenticationToken;
                obj[userId] = res.body.user.userId;
                if (printAuthToken) console.log("Hint Auth Token :".underline.green , obj[property]);
                done();
            });
    }
};

exports.getAuthToken2 = function(obj, property, userId ,printAuthToken){
    return function (done) {
        api.post('/api/login/facebook')
            .send({
                access_token: config.facebook_access_token_2,
                device:'test-computer'
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
                obj[property] = res.body.authenticationToken;
                obj[userId] = res.body.user.userId;
                if (printAuthToken) console.log("Hint Auth Token :".underline.green , obj[property]);
                done();
            });
    }
};
