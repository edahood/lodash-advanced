
const expect = require('chai').expect;
const loader = require('../index');

describe('loader files', function() {
    describe('loading', function(){
        it('should return a function', function() {
            expect(loader).to.be.a('function');
        });
        it('should add mixins to global lodash', function(){
            require('./helpers/pre-load');

            const lodash = require('lodash');
            expect(lodash).to.have.property('forceArray');

        })
    })
});
