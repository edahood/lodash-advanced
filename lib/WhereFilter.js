'use strict';

const lodash = require('lodash');
const getKeys = lodash.keys;

const DEFAULT_FILTERS =  {
    'between': 'between',
    'lt': 'lt',
    'lte': 'lte',
    'gt': 'gt',
    'gte': 'gte',
    'eq': 'eq',
    'in': 'includes',
    'neq': 'neq',
    'nin': 'nin',
    'any': 'any',
    'nil': 'isNil',
    'null': 'isNull',
    'notnil': 'isNotNil',
    'notnull': 'isNotNull',
    '!null': 'isNotNull',
    '!nil': 'isNotNil',
    '!in': 'nin',
    '!eq': 'neq',
    '!=': 'neq',
    '>': 'gt',
    '>=': 'gte',
    '<': 'lt',
    '<=': 'lte',
    'ilike': 'ilike',
    'like': 'like',
    'startsWith': 'startsWith',
    'endsWith': 'endsWith',
    'all': 'all',
};
const INVERSED = ['in', 'nin', 'any', '!in'];
const noArgs = ['nil', 'null', 'notnil', 'notnull', '!nil', '!null'];
const KEYS_GROUPING = ['and', 'or'];


const allWhereKeys = function(filters=DEFAULT_FILTERS, grouping=KEYS_GROUPING) {
    return [].concat(grouping, ...getKeys(filters));
};
class WhereFilter {
    constructor(where = {}, _=lodash) {
        this.where = where;
        this.__ = _;
        this.filters = {};
    }
    getTheArgs(name, val) {
        let {includes, bind} = this.__;
        if (includes(noArgs, name)) {
            return [];
        } else if (includes(INVERSED, name)) {
            return [val];
        } else {
            return [bind.placeholder, val];
        }
    }
    getFilter(name){
        return this.__.get(this.filters, name);
    }
    allFilterNames(){
        return [].concat(KEYS_GROUPING, ...getKeys(this.filters));
    }
    hasFilters(value){
        let {isObject, isArray, chain} = this.__;
        return !isArray(value) && isObject(value) &&
            chain(this.allFilterNames())
                .intersection(getKeys(value))
                .isEmptyNot()
                .value();
    }
    parseWherePiece(value) {
        let {bind, chain, isFunction} = this.__;
        let getTheArgs = this.getTheArgs.bind(this);
        return chain(value)
            .map((val, comp) => {
                let filt = this.getFilter(comp);
                if(!isFunction(filt)){ throw new Error('Could not find where filter named ' + comp);}
                return bind(filt, null, ...getTheArgs(comp, val));
            })
            .allTruthyByTasks()
            .value();
    }
    parseWhere(where) {
        let {each, whereMatches, allTruthyByTasks, anyTruthyByTasks, bind, splitUntil, map, conforms, isEmpty} = this.__;
        let built = {};
        let groupedFns = [];
        let boundWhere = this.parseWhere.bind(this);
        each(where, (value, keyname) => {
            let comp = 'eq'; // Default to be eq to support {[propertyName]: value} simple matches
            switch (keyname) {
                case 'and':
                    groupedFns.push(allTruthyByTasks(map(value, boundWhere)));
                    break;
                case 'or':
                    groupedFns.push(anyTruthyByTasks(map(value, boundWhere)));
                    break;
                default:
                    let [prop, selector] = splitUntil(keyname, '.', 1);
                    if (selector && !isEmpty(selector)) {
                        let arrProps = {prop, selector};
                        arrProps.newWhere = {[selector]: value};
                        built[prop] = bind(whereMatches, null, bind.placeholder, arrProps.newWhere);
                    } else if (!this.hasFilters(value)) {
                        built[keyname] = this.parseWherePiece({[comp]: value});
                    } else {
                        built[keyname] = this.parseWherePiece(value);
                    }

            }
        });
        if (isEmpty(groupedFns)) {
            return conforms(built);
        }  else {
            return allTruthyByTasks(groupedFns);
        }
    }
    run(data, where) {
        let {isEmpty, filter,isArray, first, identity,forceArray} = this.__;
        if (!isEmpty(where)) { this.where = where;}
        if (isEmpty(this.where)) { return data; }
        let ret = isArray(data) ? identity : first;
        let result = filter(forceArray(data),  this.parseWhere(this.where));
        return ret(result);
    }
}


WhereFilter.buildFilters = function(_, cfg) {
    let {reduce, isFunction, assign} = _;
    let args = (Array.from(arguments)).slice(1);
    return reduce(args, (out, arg) => {
         assign(out, reduce(arg, (current, method, name) => {
            current[name] = isFunction(method) ? method : _[method];
            return current;
        }, {}));
         return out;
    }, {})
};

WhereFilter.factoryBuilder = function(_) {
    let filters = WhereFilter.buildFilters(_, DEFAULT_FILTERS);
    return (where) => {
      let w = new WhereFilter(where, _);
      w.filters = _.assign({}, filters);
      return w;
    };
};

WhereFilter.INVERSED = INVERSED;
WhereFilter.noArgs = noArgs;
WhereFilter.KEYS_GROUPING = KEYS_GROUPING;

module.exports = WhereFilter;