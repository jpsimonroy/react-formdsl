var _ = require('underscore');
var classnames = require('classnames');
var optionsFor = function(array, name) {
  if(!array){
    return [];
  }
  name = name || "name";
  return array.map(function(v) {
    return {
      label: v[name],
      value: v.id
    };
  });
};
var errorClass = function(valid) {
  return classnames({
    'hidden': valid
  });
};
var emptyClass = function(val) {
  return classnames({
    'empty': !val
  });
};

module.exports.optionsFor = optionsFor;
module.exports.errorClass = errorClass;
module.exports.emptyClass = emptyClass;
