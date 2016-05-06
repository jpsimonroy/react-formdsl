var _ = require('underscore');
var Immutable = require('immutable');
var Validators = require('./validators');
var $ = require('jquery');
var Actions = function() {
  return {
    _withConjunctions: function(conjunctions, formElements) {
      var that = this;
      if (_.isEmpty(conjunctions)) {
        return true;
      }
      return _.every(conjunctions, function(c) {
        if (c.type === 'form_elements') {
          if (formElements) {
            return _.contains(c.value, formElements[c.key]);
          }
          return false;
        } else {
          var fromState = _.find(that.state, function(s) {
            return s.object.id === c.key;
          });
          if (fromState) {
            return _.contains(c.value, fromState.element.value);
          } else {
            console.log('Cannot find element with id:' + c.key);
          }
          return false;
        }
      });
    },
    autoSave: function(elementId, value, callback, formElements, override) {
      var that = this;
      var fromState = _.find(this.state, function(s) {
        return s.object.id === elementId;
      });
      if (!fromState) {
        console.log('Element Not found:' + elementId);
        return;
      }
      if (this.mode === 'edit') {
        if (override || !fromState.element.meta.disabled_on_edit) {
          fromState.element.setValue(value, () => {
            callback(this.getState());
          });
        } else {
          return;
        }
      } else {
        fromState.element.setValue(value, () => {
          callback(this.getState());
        });
      }
      fromState.object.dirty = true;
      var asString = function(values) {
        return values.map(function(v) {
          return String(v);
        });
      };
      var containsPredicate = function(value, bounds) {
        if (value instanceof Array) {
          return !_.isEmpty(_.intersection(value, bounds));
        } else {
          var isNegation = (bounds instanceof Array && bounds.length > 0) ? bounds[0].charAt(0) === '!' : false;
          if (isNegation) {
            return _.all(bounds, function(b) {
              var val = b.substring(1);
              return val !== value;
            });
          } else {
            return _.any(bounds, function(b) {
              return b === value;
            });
          }
        }
      };
      var transitiveStateChanges = function(targetElement, ignoreTargets) {
        targetElement.object.state = 'off';
        if (targetElement.object.transitions) {
          _.filter(targetElement.object.transitions, function(t) {
            return t.type === 'state' && t.state === 'on';
          }).forEach(function(e) {
            var targetElements = _.filter(that.state, function(s) {
              return _.contains(e.target, s.object.id);
            });
            _.filter(targetElements, function(t) {
              return !_.contains(ignoreTargets, t.object.id);
            }).forEach(function(t) {
              transitiveStateChanges(t, ignoreTargets);
            });
          });
        }
      };
      if (fromState.object.transitions) {
        var groupedTransitions = _.partition(fromState.object.transitions, function(t) {
          return t.type === 'state' && (containsPredicate(value, asString(t.onValue)) || _.contains(asString(t.onValue), "*"));
        });
        var elementsBecomingActive = _.flatten(_.map(groupedTransitions[0], function(t) {
          return t.target;
        }));
        var ignoreTargets = [];
        var applyStateTransition = function(transitions, state) {
          _.each(transitions, function(t) {
            _.each(t.target, function(target) {
              var targetElement = _.find(that.state, function(s) {
                return s.object.id === target;
              });
              if (!targetElement) {
                console.log('Unable to find target:' + target);
              } else {
                if (state === 'on' && that._withConjunctions(t.conjunction, formElements)) {
                  ignoreTargets.push(targetElement.object.id);
                  targetElement.object.state = state;
                } else if (state === 'off' && !_.contains(elementsBecomingActive, targetElement.object.id)) {
                  transitiveStateChanges(targetElement, ignoreTargets);
                }
              }
            });
          });
        };
        //Applicable Transitions
        applyStateTransition(groupedTransitions[0], 'on');
        //For Rollback
        applyStateTransition(groupedTransitions[1], 'off');
      }
      if (callback) {
        callback(this.getState());
        that.eventBus.trigger(this.changedEvent, [true]);
      }
    },
    getActionableState(options, callback, type){
      var that = this;
      var state = this.getState();
      if (!state.validations.model) {
        console.log('Skipping Submit...');
        return;
      }
      this.loading = true;
      options = options || {};
      if (callback) {
        callback(state, false, this.offset);
        that.eventBus.trigger(this.changedEvent);
      }
      var submittableData = options;
      if(type){
        submittableData = _.extend(options, {
          type: type
        });
      }
      state.formElements.forEach(function(f) {
        if (f.object.submission_tag) {
          submittableData[f.object.submission_tag] = submittableData[f.object.submission_tag] || {};
          submittableData[f.object.submission_tag][f.object.id] = f.element.get('value');
        } else {
          submittableData[f.object.id] = f.element.get('value');
        }
      });
      return submittableData;
    },
    takeAction: function(options, callback, type, success, failure) {
      var submittableData = this.getActionableState(options, callback, type);
      var that = this;
      $.ajax({
        url: (this.context.url || window.apiContext) + that.submitPath,
        type: 'POST',
        data: JSON.stringify(submittableData),
        contentType: 'application/json',
        dataType: "json"
      }).done(function(data) {
        that.onSuccess(data, success);
      }).fail((jqXHR, textStatus, errorThrown) => {
        if (failure) failure(jqXHR);
      }).always(() => {
        that.alwaysAfterAction(callback);
      });
    },
    onSuccess: function(data, success){
      if (success) success(data);
      this.state = [];
      this.initialized = false;
    },
    alwaysAfterAction:function(callback){
      this.loading = false;
      if (callback) callback(this.getState(), false, this.offset);
      this.eventBus.trigger(this.changedEvent);
    }
  };
};
module.exports = Actions;
