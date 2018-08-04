'use strict';
const dash = require('lodash');
const DEFAULT_OPTIONS = {isolate: false, mixins: [], context: {}};
const AVAILABLE_MIXINS = [
    'utils',
    'uid',
    'not',
    'where',
    'jsonArray',

];

module.exports = function({lodash=dash, isolate=false, mixins=[...AVAILABLE_MIXINS], context={}, options={}}={}) {
    let _ = isolate ? lodash.runInContext(context) : lodash;
    let needed = [].concat(AVAILABLE_MIXINS);
    if(!_.isEmpty(mixins)){ needed = _.intersection(AVAILABLE_MIXINS, mixins); }
    _.each(needed, (mixin) => {
        let full = require(`./mixins/${mixin}.mixin`)(_);
        let filtered = full;
        _.mixin(filtered);
    });
    return _;
}