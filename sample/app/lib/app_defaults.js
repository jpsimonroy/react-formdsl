var moment = require('moment');
var _ = require('underscore');
var React = require('react');
var AppDefaults = {
  errorText: function(jqxhr) {
    if (jqxhr.responseJSON) {
      if (jqxhr.responseJSON instanceof Array) {
        return _.map(jqxhr.responseJSON, function(t) {
          return t.message;
        }).join(', ');
      } else {
        return jqxhr.responseJSON.message;
      }
    }
    return null;
  },
  withDefault: function(str, def) {
    def = !def ? 'n.a' : def;
    return (!str || _.isEmpty(str)) ? def : str;
  }
};

module.exports = AppDefaults;
