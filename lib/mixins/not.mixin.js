'use strict';

const lodash = require("lodash");
const {NOT} = require('../helpers');

function addMixins(_=lodash){
   return {
       'isEmptyNot': NOT(_.isEmpty),
       'isNilNot': NOT(_.isNil),
       'isNullNot': NOT(_.isNull),
       // END DEPERACTED SECTION

       'isNotNil': NOT(_.isNil),
       'isNotNull': NOT(_.isNull),
       'isNotEmpty': NOT(_.isEmpty),
    };
};
module.exports = addMixins;
module.exports.addMixins = addMixins;
module.exports.names = Object.keys(addMixins());
