

const loader = require('../../index');
const lodash = require('lodash');
const _ = loader(lodash, {isolated: false});

module.exports = {
    lodash,
    _,
    loader
};