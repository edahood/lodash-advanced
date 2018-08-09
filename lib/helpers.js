'use strict';
const lodash = require('lodash');

function NOT(method){
    return function() {
        let args = Array.from(arguments);
        return !method(...args);
    };
}

function evaluator(funcs) {
    return (val) => { return funcs.map((curr) => { return curr(val); });};
}
function evaluatorBound(funcs) {
    return (val) => { return funcs.map((curr) => { return () => {return curr(val); }});};
}
let addMixinsIfNeeded = ( _=lodash, mixins, force=[]) => {
    let needed = _.reduce(mixins, (current, fn, name) => {
        if (!_.isFunction(_[name]) || _.includes(force, name)) { current[name] = fn; }
        return current;
    }, {});
    if (!_.isEmpty(needed)) {
        _.mixin(needed);
    }
    return Object.keys(needed);
};

module.exports = {
    NOT,
    evaluator,
    evaluatorBound,
    addMixinsIfNeeded
};

