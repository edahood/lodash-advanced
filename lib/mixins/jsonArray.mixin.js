'use strict';
const lodash = require("lodash");
const JSON_PATTERNS = {
    'array': ['[', ']'],
    'object': ['{', '}'],
    'string': ['"','"']
};

function addMixins(_=lodash){
    return {
        isJSON(txt, matchType = null) {
            var json_type = false;
            let allowed = !_.isNil(matchType) ? _.forceArray(matchType) : _.keys(JSON_PATTERNS);
            _.each(JSON_PATTERNS, (curr, name) => {
                    if (_.includes(allowed, name) && _.isEqual(curr, [_.first(txt), _.last(txt)])) {
                        json_type = name;
                        return false;
                    }
                }
            )
            return json_type;
        }
    };

}
module.exports = addMixins;
module.exports.addMixins = addMixins;
module.exports.names = Object.keys(addMixins());