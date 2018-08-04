'use strict';

const debug = require('debug')("lodash:plus");
const loader = require('./lib/index');
let _;

function load(lodash=_, options={}){
    if(!lodash){lodash = require('lodash');}
   let res = loader({lodash, ...options});
   if(!_){_ = res;}
   return res;
}

module.exports = load;