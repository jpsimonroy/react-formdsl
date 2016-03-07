var Immutable = require('immutable');
var _ = require('underscore');
var StateFusion = function() {
  return {
    withSubState(state, full = false, offset = 'actionable') {
      if (_.isEmpty(state.formElements)) {
        this.immutableState = this.immutableState.setIn(['digest', offset], Immutable.fromJS(state));
        return;
      }
      if (full) {
        this.immutableState = this.immutableState.setIn(['digest', offset], Immutable.fromJS(state));
      } else {
        var mergedFormElements = this.immutableState.get('digest').get(offset).get('formElements');
        var existingFormElements = mergedFormElements.map(function(m) {
          return m.get('object').get('id');
        });
        var additionalElements = _.filter(state.formElements, function(s) {
          return existingFormElements.indexOf(s.object.id) === -1;
        });
        var newElements = state.formElements.map(function(f) {
          return f.object.id;
        });
        mergedFormElements = mergedFormElements.filter(function(f) {
          return _.contains(newElements, f.get('object').get('id'));
        }).map(function(f) {
          var elementFromState = _.find(state.formElements, function(s) {
            return s.object.id === f.get('object').get('id');
          });
          if (elementFromState.object.dirty) {
            return Immutable.fromJS(elementFromState);
          }
          return f;
        }).concat(Immutable.fromJS(additionalElements)).sortBy(function(a) {
          return a.get('index');
        });
        this.immutableState = this.immutableState.setIn(['digest', offset, 'loading'], state.loading);
        this.immutableState = this.immutableState.setIn(['digest', offset, 'formElements'], mergedFormElements);
        this.immutableState = this.immutableState.setIn(['digest', offset, 'validations'], Immutable.fromJS(state.validations));
      }
    }
  };
};

module.exports = StateFusion;
