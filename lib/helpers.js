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

module.exports = {
    NOT,
    evaluator,
    evaluatorBound
};

