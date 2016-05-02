"use strict";
var _ = require('underscore');
var Immutable = require('immutable');
var Deferrable = require('./deferrable');
var FormField = require('./form_field.js');
var Required = require('./validators.js').Required;
var Enumerated = require('./validators.js').Enumerated;
var Validators = require('./validators');
var StateMachineActions = require('./state_machine_actions');
var errorText = function(jqxhr) {
  if (jqxhr.responseJSON) {
    if (jqxhr.responseJSON instanceof Array) {
      return _.map(jqxhr.responseJSON, function(t) {
        return t.message;
      }).join(', ');
    } else {
      return jqxhr.responseJSON.message;
    }
  }
  return '';
};
var FormStateMachine = class {
  constructor(fetchUrl, submitPath, postCompile, context, changedEvent, forceCall, offset = 'actionable') {
    this.path = fetchUrl;
    this.state = [];
    this.loading = false;
    this.initialized = false;
    this.submitPath = submitPath;
    this.postCompile = postCompile;
    this.context = context;
    this.localMaster = {};
    this.noCache = forceCall;
    this.changedEvent = changedEvent;
    this.offset = offset;
    _.extend(this, Deferrable(FormStateMachine, !!this.noCache),
      StateMachineActions());
  }
  getState() {
    var elementsTurnedOn = _.filter(this.state, d => d.object.state === 'on');
    var that = this;
    var formElements = elementsTurnedOn.map(function(e) {
      return {
        element: e.element.getState(),
        object: e.object,
        index: e.index
      };
    });
    var applyEnvelopeValidations = function(id) {
      var elem = _.find(elementsTurnedOn, e => e.object.id === id).element;
      return (typeof elem['isValid'] === 'function') ? elem.isValid() : true;
    };
    var modelValid = _.every(formElements, function(e) {
      return Immutable.List.isList(e.element) ? applyEnvelopeValidations(e.object.id) && e.element.every(f => f.get('valid')) : e.element.get('valid');
    });
    var groupValidationResults = {};
    if (this.groupValidators) {
      _.each(this.groupValidators, function(v, k) {
        var groupContents = _.filter(formElements, function(f) {
          return f.object.tag === k;
        });
        groupValidationResults[k] = Validators[v](groupContents);
      });
    }
    return {
      local: that.localMaster,
      validations: {
        model: modelValid && _.every(groupValidationResults, function(v, k) {
          return v.valid;
        }),
        groupValidations: groupValidationResults
      },
      initialized: that.initialized,
      loading: that.loading,
      formElements: formElements
    };
  }
  init(id, type, eventBus, callback, mode, options = null, failure = null) {
    this.identifier = id;
    this.initialized = true;
    if (type) {
      id = type + id;
    }
    if (!this.noCache && id === this.id && !_.isEmpty(this.state)) {
      return;
    }
    this.state = [];
    this.mode = mode;
    this.eventBus = eventBus;
    this.id = id;
    var that = this;
    that.loading = true;
    this.callback = callback;
    if (callback) callback(that.getState(), true, this.offset);
    this.eventBus.trigger(that.changedEvent);
    var queryParams = { type: type };
    if(!_.isNull(options)) queryParams = _.extend(queryParams, options);
    this.get(queryParams).done(function(data) {
      that.compile(data.toJS());
    }).fail(function(errorThrown, jqXHR) {
      if(failure) failure(jqXHR);
    }).always(function() {
      that.loading = false;
      if (callback) callback(that.getState(), true, that.offset);
      that.eventBus.trigger(that.changedEvent);
    });
  }
  compile(data) {
    this.localMaster = Immutable.fromJS(data.local);
    var groupValidators = {};
    var that = this;
    var state = data.definitions.map(function(d, index) {
      var validators = [new Required()];
      if (_.contains(d.validators, 'enum')) {
        validators.push(new Enumerated());
      }
      if (_.contains(d.validators, "group::all_or_none")) {
        validators = [];
        groupValidators[d.tag] = 'allOrNull';
      }
      if (_.contains(d.validators, 'none')) {
        validators = [];
      }
      var fieldInstance = {
        object: d,
        index: index
      };

      fieldInstance.element = new FormField((!_.isNull(d.value) && !_.isUndefined(d.value)) ? d.value : null, validators, d);
      return fieldInstance;
    });
    _.each(state, function(s) {
      if (s.object.transitions) {
        _.each(s.object.transitions, function(t) {
          var targets = t.target;
          _.each(targets, function(t) {
            if (!_.find(state, function(s) {
                return s.object.id === t;
              })) {
              console.log('ERROR: Unable to locate target:' + t);
            }
          });
        });
      }
    });
    this.groupValidators = groupValidators;
    this.state = state;
    if (this.postCompile) this.postCompile.bind(this.context)(state);
  }
};
module.exports = FormStateMachine;
