'use strict';
const lodash = require("lodash");
const {NOT, evaluatorBound} = require('../helpers');
const WhereFilter = require('../WhereFilter');

function addMixins(_=lodash){
    let getFactory = WhereFilter.factoryBuilder.bind(WhereFilter, _);
    let whereFactory;
   return {
       'nin': NOT(_.includes),
       'neq': NOT(_.eq),
       'between': (val, values, inclusive=true) => {
           let meth = {low: _.gte, high: _.lte};
           if(!inclusive){
               meth.low = _.gt;
               meth.high = _.lt;
           }
           return meth.low(val, values[0]) && meth.high(val, values[1]);
       },
       'any': (values, checkValues) => {
           let check = _.forceArray(checkValues);
           return _.chain(values)
               .intersection(check)
               .isEmptyNot()
               .value();
       },
       'ilike': (value, pattern) => {
           let reg = new RegExp(pattern, 'i');
           return reg.test(value.toString());
       },
       'like': (value, pattern) => {
           let reg = new RegExp(pattern);
           return reg.test(value.toString());
       },
       'all': (values, otherValues) => {
           return _.chain(values)
               .intersection(otherValues)
               .isEqual(otherValues)
               .value();
       },
       where: (values, whereFilter = {}) => {
           if(!whereFactory){ whereFactory = getFactory();}
           return whereFactory(whereFilter).run(values);
       },
       allTruthyByTasks: function(funcs) {
           let fn = evaluatorBound(funcs);
           return (val) => { return _.allTruthy(fn(val)); };
       },
       anyTruthyByTasks: function(funcs){
           let fn = evaluatorBound(funcs);
           return (val) => { return _.anyTruthy(fn(val));};
       },
       whereMatches: (values, nested = {}) => {
           return _.chain(values)
               .forceArray()
               .where(nested)
               .isNotEmpty()
               .value();
       }
    };
};
module.exports = addMixins;
module.exports.addMixins = addMixins;
module.exports.names = Object.keys(addMixins());
