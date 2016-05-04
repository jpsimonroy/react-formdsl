var _ = require('underscore');
var Immutable = require('immutable');
var $ = require('jquery');
var Events = require('./../../context/events').events;
var FormStateMachine = require('react-formdsl').FormStateMachine;
var StateFusion = require('react-formdsl').StateFusion;
var Actionable = require('./actionable');
var Deferrable = require('./../../lib/models/services/deferrable');
var AppDefaults = require('./../../lib/app_defaults');
var ModelMux = require('./../../context/model_mux');

var Basic = class extends ModelMux {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
    this.identifier = 'basic';
    this.eventBus.on(`${this.eventIdentifier()}::actionable`, evt => this.iAmChanged());
    this.reset();
    _.extend(this, Deferrable(Basic, true, true), Actionable, StateFusion());
  }
  reset() {
    this.actionable = new FormStateMachine('/services/ticket_system', '/services/ticket_system',
       null, this, `${this.eventIdentifier()}::actionable`);
    this.actionable._flushCache();
    this.state = this.emptyState();
    this.immutableState = Immutable.fromJS(this.state);
  }
  emptyState() {
    var that = this;
    return {
      digest: {
        actionable: that.actionable.getState()
      }
    };
  }
  setLoading(loading, pathlets = ['expel']) {
    var stateOffset = _.reduce(pathlets, (s, p) => s[p], this.state);
    stateOffset.loading = loading;
    pathlets.push('loading');
    this.immutableState = this.immutableState.setIn(pathlets, loading);
    this.iAmChanged();
  }
  getState() {
    return this.immutableState;
  }
};

module.exports = Basic;
