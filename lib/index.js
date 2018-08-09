'use strict';
const dash = require('lodash');
const {addMixinsIfNeeded} = require('./helpers');
const DEFAULT_OPTIONS = {isolate: false, mixins: [], context: {}};
const AVAILABLE_MIXINS = [
    'utils',
    'uid',
    'not',
    'where',
    'jsonArray',

];

module.exports = function({lodash=dash, isolate=false, mixins={}, mixinGroups=[...AVAILABLE_MIXINS], context={}, options={}}={}) {
    let _ = isolate ? lodash.runInContext(context) : lodash;
    let needed = [].concat(AVAILABLE_MIXINS);
    let force = ['isDate'];
    let _addMixinsIfNeeded = addMixinsIfNeeded.bind(null, _);
    if(!_.isEmpty(mixinGroups)){ needed = _.intersection(AVAILABLE_MIXINS, mixinGroups); }
    let allMixins = Object.assign({}, mixins||{});
    _.each(needed, (mixin) => {
        let full = require(`./mixins/${mixin}.mixin`)(_);
        let filtered = full;
        Object.assign(allMixins, filtered);
    });
    allMixins.addMixinsIfNeeded = _addMixinsIfNeeded;
    _addMixinsIfNeeded(allMixins, force);

    return _;
}