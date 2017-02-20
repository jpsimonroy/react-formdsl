  var _ = require('underscore');
var Immutable = require('immutable');
var FormField = function(initialValue, validators, meta) {
  this.meta = _.isNull(meta) ? null : Immutable.fromJS(meta);
  this.value = initialValue;
  this.initialValue = initialValue;
  this.validators = validators;
  this.immutableState = Immutable.fromJS(this.getInitialState());
};

FormField.prototype.setValidators = function(validators) {
  this.validators = validators;
};

FormField.prototype.setMeta = function(meta) {
  this.meta = _.isNull(meta) ? null : Immutable.fromJS(meta);
};

FormField.prototype.getInitialState = function() {
  var that = this;
  return {
    value: that.value,
    valid: true,
    messages: [],
    meta: that.meta
  };
};

FormField.prototype.setValue = function(value) {
  this.value = value;
};

FormField.prototype.getState = function() {
  var that = this;
  var errorMessages = that.validate();
  var newState = {
    value: that.value,
    valid: _.isEmpty(errorMessages),
    changed: _.isEqual(that.value, that.initialValue) && !_.isEmpty(that.initialValue)
  };
  this.immutableState = this.immutableState.merge(newState);
  if (!_.isEqual(this.immutableState.get('messages').toJS(), errorMessages)) {
    this.immutableState = this.immutableState.setIn(['messages'], Immutable.fromJS(errorMessages));
  }
	this.immutableState = this.immutableState.setIn(['meta'], that.meta);
  return this.immutableState;
};

FormField.prototype.validate = function() {
  var errors = [];
  var that = this;
  if (this.validators) {
    _.each(this.validators, function(v) {
      var validity = v(that.value, that.meta);
      if (validity) errors.push(validity);
    });
  }
  return errors;
};

module.exports = FormField;
