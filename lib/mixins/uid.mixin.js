'use strict';
const uuid = require('uuid/v4');
const lodash = require("lodash");

function addMixins(_=lodash){
   return {
        uuid: () => { return uuid(); }
    };
};
module.exports = addMixins;
module.exports.addMixins = addMixins;
module.exports.names = Object.keys(addMixins());
