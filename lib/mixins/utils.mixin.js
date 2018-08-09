'use strict';
const JSON_PATTERNS = {
    'array': ['[', ']'],
    'object': ['{', '}'],
    'string': ['"','"']
};
const lodash = require("lodash");

function getPathString({currPath, sep}, subpath) {
    return lodash.isEmpty(currPath) ? subpath : `${currPath}${sep}${subpath}`;
}

function addMixins(_=lodash){
    let converterTools = require('../converters')(_);
    let {convertTo, getMoment, checkDate} = converterTools;
    let addNewConverter = converterTools.addConverter;
    return {
        splitUntil: (str, pattern, limit=-1) => {
            return _.chain(str)
                .split(pattern)
                .thru((arr) => {
                    if(limit < 1){ return arr;}
                    let remainder = arr.slice(limit);
                    let left = !_.isEmpty(remainder) ? [remainder.join(pattern)] : [];
                    return [...arr.slice(0, limit)].concat(...left);
                })
                .value();
        },
        isPromise(obj){
            return !!obj &&
                (_.isObject(obj) || _.isFunction(obj)) &&
                ((obj instanceof Promise) || _.isFunction(obj['then']));
        },
        forceArray(obj){
            return (_.isArray(obj) ? obj: [obj]);
        },
        allTruthy: (arr) => {
            let result = true;
             _.each(arr, (item) => {
                 let isFunc = _.isFunction(item);
                 if( (isFunc && !item()) || (!isFunc && !item) ){
                     result = false;
                     return false;
                 }
            })
            return result;
        },
        anyTruthy: (arr) => {
            let result = false;
            _.each(arr, (item) => {
                let isFunc = _.isFunction(item);
                if((isFunc && item()) || (!isFunc && item)){
                    result = true;
                    return false;
                }
            })
            return result;
        },
        deannotate(obj){
            let currPrefix = '';
            let {set, reduce, map, deannotate, isArray} = _;
            if (isArray(obj)) { return map(obj, deannotate); }
            return reduce(obj, (current, value, key) => {
                set(current, `${currPrefix}${key}`, value);
                return current;
            }, {});
        },
        annotate(obj, {currPath = '', sep = '.'}={}){
            let {annotate, isObject, isDate, reduce} = _;
            const gpathFn = getPathString.bind(null, {currPath, sep});
            return reduce(obj, (current, val, key) => {
                let gpath = gpathFn(key);
                if (isDate(val)){
                    current[gpath] = val;
                } else if (isObject(val)) {
                    let subResult = annotate(val, {currPath: gpath, sep});
                    Object.assign(current, subResult);
                } else {
                    current[gpath] = val;
                }
                return current;
            }, {});
        },
        isDate(value) {
            let checkResult = checkDate(value);
            return checkResult.isADate;
        },
        to(value, type = 'string') {
            return convertTo(value, type);
        },
        addConverter(name, fn) {
            return addNewConverter(name, fn);
        },
        takeLeftSlice(collection, howMany = null, skip = 0) {
            let res = [];
            if(_.isNil(howMany) || howMany <= 0 ){
                howMany = 0;
            }
            while(res.length < howMany && !_.isEmpty(collection)){
               res.push(collection.shift());
            }
            return res;
        },
        prettyJSON(object, indents=2){
            return JSON.stringify(object, null, indents);
        }

    };
}
module.exports = addMixins;
module.exports.addMixins = addMixins;
module.exports.names = Object.keys(addMixins());