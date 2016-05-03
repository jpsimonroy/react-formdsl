var App = require('./../../context/events');
var List = require('immutable').List;
var _ = require('underscore');
var Immutable = require('immutable');
var BasicActionable = {
  onActionTakenSuccess: function(data) {
    setTimeout(() => {
      this.reset();
      this.initBasic();
    });
  },
  autoSave: function(evt, element, value) {
    this.actionable.autoSave(element, value, e => {
      this.withSubState.bind(this)(e, false, 'actionable');
    }, null);
  },
  takeAction: function() {
    this.actionable.takeAction(null, this.withSubState.bind(this), null, this.onActionTakenSuccess.bind(this));
  },
  initBasic: function() {
    this.actionable.init(null, null, this.eventBus, this.withSubState.bind(this));
    this.iAmChanged();
  }
};
module.exports = BasicActionable;
