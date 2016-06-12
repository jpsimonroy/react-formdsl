var _ = require('underscore');
var s = require("underscore.string");
var moment = require('moment');
var Required = function(message) {
  return function(value) {
    if (!value || s(String(value)).trim().value() === '') {
      return message || 'This field is required';
    }
  };
};

var EmailOrContact = function() {
  return function(value) {
    var emailValid = Email()(value);
    var mobileValid = MobileNumber()(value);
    if(_.some([!emailValid, !mobileValid])){
      return;
    }
    return 'Not a valid email or contact number';
  };
};

var WholeNumeric = function(message) {
  return function(value) {
    if (typeof(value) === 'number') {
      value = String(value);
    }
    var n = ~~Number(value);
    if (value && (String(n) !== value || n < 0)) {
      return message || 'Only Positive Numbers Allowed';
    }
  };
};
var FutureDate = function(message) {
  return function(value) {
    if (typeof(value) === 'number') {
      value = String(value);
    }
    var date = moment(value);
    if(date.isBefore(moment().startOf('day'))){
      return message || 'Please select a future date';
    }
  };
};

var MinLength = function(length) {
  return function(value) {
    if (value && String(value).length < length) {
      return 'Should be of min ' + length + ' chars long';
    }
  };
};

var MaxLength = function(length) {
  return function(value) {
    if (value && value.toString().length > length) {
      return 'Should not be more than ' + length + ' chars long';
    }
  };
};

var ContactNumber = function(value) {
  return function(value) {
    if (value && (String(value).length < 8 || String(value).length > 15)) {
      return 'Invalid Contact Number';
    }
  };
};

var MobileNumber = function(value) {
  return function(value) {
    if (value && (String(value).length !== 10)) {
      return 'Invalid Mobile Number';
    }
  };
};

var Email = function(value) {
  return function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value && !re.test(value)) {
      return 'Invalid Email address';
    }
  };
};
var Url = function(value) {
  return function(value) {
    var reURL = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (value && !reURL.test(value)) {
      return 'Invalid URL';
    }
  };
};

var Enumerated = function() {
  return function(value, meta) {
    if (value && meta.valid_values && !_.contains(meta.valid_values, value)) {
      return "Can only take values " + meta.valid_values.join(' or ');
    }
  };
};

var allOrNull = function(fields) {
  fields = _.map(_.filter(fields, f => !f.object.skip_group_validation), f => f.element);
  if (_.every(fields, function(f) {
      return f.get('value') !== null && f.get('value') !== '';
    }) || _.every(fields, function(f) {
      return f.get('value') === null || f.get('value') === '';
    })) {
    return {
      valid: true,
      message: null
    };
  } else {
    return {
      valid: false,
      message: 'Please select all values or none.'
    };
  }
};

module.exports.Required = Required;
module.exports.MaxLength = MaxLength;
module.exports.WholeNumeric = WholeNumeric;
module.exports.MinLength = MinLength;
module.exports.ContactNumber = ContactNumber;
module.exports.Email = Email;
module.exports.Enumerated = Enumerated;
module.exports.Url = Url;
module.exports.FutureDate = FutureDate;
module.exports.EmailOrContact = EmailOrContact;
module.exports.allOrNull = allOrNull;
