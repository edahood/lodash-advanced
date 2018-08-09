'use strict';
const lodash = require('lodash');
let Moment;


let converters = {};
let methods = {};
function addMethods(_=lodash){
    function getMoment(){
        if(!Moment){
            Moment = require('moment');
            Moment.suppressDeprecationWarnings = true;
        }
        return Moment;
    }
    if(!_.isEmpty(methods)){
        return methods;
    }
    function checkDate(value){
        let moment = getMoment();
        let isDate = moment.isDate(value);
        let isMoment = moment.isMoment(value);
        let isDateStr = _.isString(value);
        let isTimestamp = _.isNumber(value);
        isMoment = isMoment && value.isValid();
        let theMoment = moment( value );
        isDateStr = isDateStr && theMoment.isValid();
        isTimestamp = isTimestamp && theMoment.isValid();
        let result = isDate === true || isMoment === true || isDateStr === true || isTimestamp  === true;
        let out =  {
            isADate: result,
            _isMoment: isMoment,
            _isDate: isDate,
            _isTimestamp: isTimestamp,
            _isDateString: isDateStr,
            _value: value
        };
        return out;
    }
    function addConverter(name, fn){
        if(_.isObject(name)){
            return _.map(name, (func, funcName) => {
                return addConverter(funcName, func);
            })
        }
        else {
            let all = getConverters();
            let theName = name.toLowerCase();
            all[theName] = fn;
            return theName;
        }
    }

    function getConverters(){
        return converters;
    }
    function hasConverter(name){
        return _.has(getConverters(), name.toLowerCase());
    }
    function getConverter(name='DEFAULT'){
        let all =getConverters();
        let theName = name.toLowerCase();
        let theKey = theName;
        if(!_.has(all, theName)){
            theKey = 'DEFAULT';
        }

        return all[theKey];
    }

    function convertTo(value, type='string'){
        let fn = getConverter(type.toLowerCase());
        return fn(value);
    }
    let baseConverters = {
        'date': function(value) {
            let checkResult = checkDate(value);
            if(checkResult.isADate){ return getMoment()(checkResult.value).toDate();}
            else { return null; }
        },
        'number': _.toNumber,
        'array': _.forceArray,
        'int': _.toSafeInteger,
        'integer': _.toSafeInteger,
        'lower': (value) => {return _.toString(value).toLowerCase();},
        'json': (value) => {
            return JSON.stringify(value);
        },
        'string': _.toString,
        'DEFAULT': _.toString
    };

    addConverter(baseConverters);
    methods = {
        checkDate,
        addConverter,
        getConverters,
        getConverter,
        convertTo,
        hasConverter,
        getMoment
    };
    return methods;
}

module.exports = function(_=lodash){
    let meths = addMethods(_);
    return meths;
};