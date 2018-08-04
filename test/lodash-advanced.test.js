
const lodash = require('lodash').runInContext();

const expect = require('chai').expect;
const loader = require('../index');

describe('lodash-plus', function() {
    describe('loading', function(){
        it('should return a function', function() {
            expect(loader).to.be.a('function');
        });
        it('should accept and mixin lodash', function(){
            let dash = lodash.runInContext();
            expect(loader(dash)).to.have.property('forceArray');
            expect(dash).to.have.property('forceArray');
            expect(lodash).to.not.have.property('forceArray');
        })
    })
    describe('utils', function(){
        let _ = loader(lodash.runInContext());
        describe('forceArray', function(){
            it('should become an array', function(){
                expect(_.forceArray(13)).to.be.a('array');
                expect(_.forceArray(13)).to.have.members([13]);
            })
            it('should do nothing', function(){
                expect(_.forceArray([13])).to.be.a('array');
                expect(_.forceArray([13])).to.have.members([13]);
            })
        })
        describe('splitUntil', function(){
            it('should work with no sep found', function(){
                let fn = _.splitUntil.bind(null, 'foo', '.', 2);
                expect(fn()).to.be.a('array');
                expect(fn()).to.have.members(['foo']);
                expect(fn()).to.have.lengthOf(1);
            })
            it('should group the remainder and rejoin', function(){
                let fn = _.splitUntil.bind(null, 'foo.name.teams.players', '.', 2);
                expect(fn()).to.be.a('array');
                expect(fn()).to.have.lengthOf(3);
                expect(fn()).to.have.members(['foo','name','teams.players']);
            })
        })
        describe('allTruthy', function(){
            let dataGood = [true, 1, true, 13, true];
            let dataBad = [true, 'fhfh', false, 0, 99];
            let dataFuncs = [true, ()=>{return true}, 13, true];
            let dataBadFuncs = [true, ()=>{return false}, 13, true];
            it('should be all truthy for truthy values', function(){
                expect(_.allTruthy(dataGood)).to.be.true;
            })
            it('should be not allTruthy for non truthy values', function(){
                expect(_.allTruthy(dataBad)).to.be.false;
            })
            it('should be all truthy for functions that are truthy', function(){
                expect(_.allTruthy(dataFuncs)).to.be.true;
            })
            it('should be not all truthy for functions that are truthy', function(){
                expect(_.allTruthy(dataBadFuncs)).to.be.false;
            })
        })
        describe('anyTruthy', function(){
            let dataGood = [true, 1, true, 13, true];
            let dataBad = [false, 0, null];
            let dataFuncs = [false, ()=>{return true}, false, 0];
            let dataBadFuncs = [false, ()=>{return false},null, 0];
            it('should work with simple values', function(){
                expect(_.anyTruthy(dataGood)).to.be.true;
            })
            it('should be negatory', function(){
                expect(_.anyTruthy(dataBad)).to.be.false;
            })
            it('should work with function resolution', function(){
                expect(_.anyTruthy(dataFuncs)).to.be.true;
            })
            it('should not match even with functions', function(){
                expect(_.anyTruthy(dataBadFuncs)).to.be.false;
            })
        })
        describe('isPromise', function(){
            it('should ignore non promises', function(){
                expect(_.isPromise([])).to.be.false;
                expect(_.isPromise(null)).to.be.false;
                expect(_.isPromise(()=>{return 13;})).to.be.false;
            })
            it('should work with a promise', function(done){
                let prom = new Promise((resolve,reject)=> {
                    setTimeout(()=>{
                        resolve(true);
                    }, 20);
                })
                prom.then(()=>{done()});
                expect(_.isPromise(prom)).to.be.true;

            })
            it('should work with a thenable', function(){
                let fn = function(blah){return 13};
                fn.then = () => {};
                expect(_.isPromise(fn)).to.be.true;

            })
        })
        describe('isDate', function(){
            it('should work on Date Object', function(){
                expect(_.isDate(new Date())).to.be.true;
            })
            it('should work on strings', function(){
                expect(_.isDate("2018-07-04 11:44:00")).to.be.true;
                expect(_.isDate("20180704 99")).to.be.false;
                expect(_.isDate("2018-07-04")).to.be.true;
            })
        })
        describe('annotation and deannotation', function(){
            let sampleObject =  {student: {age: 13, name: 'eliot'}, stars: 10};
            let sampleAnnotated = {'student.name': 'eliot', 'student.age': 13, 'stars': 10};
            describe('annotate', function(){
                it('should serialize the keys of the object', function(){
                    expect(_.annotate(sampleObject)).to.be.a('object')
                        .and.deep.include(sampleAnnotated);
                })
            })
            describe('deannotate', function(){
                it('should work on simple object', function(){
                    expect(_.deannotate(sampleAnnotated)).to.be.a('object')
                        .and.deep.include(sampleObject);
                })
            })
        })
    })
    describe('uid', function(){
        let _ = loader(lodash.runInContext());
        describe('uuid', function(){
            it('should get a uuid', function(){
                expect(_).to.have.property('uuid');
                let id = _.uuid();
                expect(id).to.be.a('string').and.have.lengthOf(36);
            })
        })
    })
    describe('not', function(){
        let _ = loader(lodash.runInContext());
        describe('isNotNull', function(){
            it('should not be null', function(){
                expect(_.isNotNull(13)).to.be.true;
                expect(_.isNotNull('foo')).to.be.true;
                expect(_.isNotNull({})).to.be.true;
                expect(_.isNotNull([])).to.be.true;
            })
            it('should be null', function(){
                expect(_.isNotNull(null)).to.be.false;
            })
        })
    })
    describe('WHERE', function(){
        let _ = loader(lodash.runInContext());
        describe('between', function(){
            it('should be between', function(){
                expect(_.between(13, [2,20])).to.be.true;
            })
            it('should work with dates', function(){
                let start = new Date();
                let offset = 1000*60*60*24;
                let end = new Date(start.getTime()+ offset*10);
                let check1 = new Date(start.getTime() + offset);
                expect(_.between(check1, [start, end])).to.be.true;
                expect(_.between(new Date(start.getTime() - offset), [start, end])).to.be.false;
            })
            it('should be exclusive', function(){
                expect(_.between(2, [2,20], false)).to.be.false;
                expect(_.between(20, [2,20], false)).to.be.false;
            })
            it('should not be between', function(){
                expect(_.between(99, [2,20])).to.be.false;
                expect(_.between(new Date(), [2,20])).to.be.false;
            })
        })
        describe('ilike', function(){
            let pattern = '^Bob';
            let str = 'bob jones inc';
            it('should apply the case insensitive matched', function() {
                expect(_.ilike(str, pattern)).to.be.true;
                expect(_.ilike('funny man', pattern)).to.be.false;
            })
        })
        describe('like', function(){
            let pattern = '^Bob';
            let str = 'bob jones inc';
            let str2 = 'Bob jones inc';
            let str3 = 'something Bob Jones';
            it('should apply the case sensitive matched', function(){
                expect(_.like(str, pattern)).to.be.false;
                expect(_.like(str2, pattern)).to.be.true;
                expect(_.like(str3, pattern)).to.be.false;
            })

        })
        describe('where', function(){
            let rows = [{name: 'jon', age: 13}, {name: 'carol', age: 80}, {name: 'men', age: 15}];
            it('should match with simple equal filter', function(){
                expect(_.where(rows, {age: 13})).to.be.a('array').and.to.have.lengthOf(1);
            })
            it('should match all with empty selector', function(){
                expect(_.where(rows, {})).to.be.a('array').and.to.have.lengthOf(3);
            })
            it('should match with complex lt matcher', function(){
                expect(_.where(rows, {age: {lt: 14}})).to.be.a('array').and.to.have.lengthOf(1);
            })
            it('should match with AND matcher on complex props', function(){
                expect(_.where(rows, {and: [{age: {lt: 30}},{age: {gte: 8}}] })).to.be.a('array').and.to.have.lengthOf(2);
            })
            it('should match with OR matcher on complex props', function(){
                expect(_.where(rows, {or: [{age: {lt: 14}},{name: 'carol'}] })).to.be.a('array').and.to.have.lengthOf(2);
            })
            it('should match with OR nested and', function(){

                expect(_.where(rows, {or: [{age: {lt: 14}},
                        {and: [{name: {like: '^car'} }, {age: {gte: 14}}] }
                        ] })).to.be.a('array').and.to.have.lengthOf(2);

                expect(_.where(rows, {or: [{age: {lt: 14}},
                        {and: [{name: {like: '^Car'} }, {age: {gte: 14}}] }
                    ] })).to.be.a('array').and.to.have.lengthOf(1);
            })
            it('should be super awesome', function(){
                expect(_.where(rows, {
                    or: [
                        {age: {gt: 70}, name: {like: 'ol$'} },
                        {name: {ilike: '^jo'} }
                    ]
                }
                )).to.have.lengthOf(2)
            })

        })
    })

});
