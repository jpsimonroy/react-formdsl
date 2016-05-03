var modelFactory = require('./model_factory');
var Events = require('./events').events;
var $ = require('jquery');

var Context = class {
  constructor(eventBus, localStorage) {
    var that = this;
    this.eventBus = eventBus;
    this.localStorage = localStorage;
    this.models = {};
    modelFactory(localStorage, eventBus, this);
    eventBus.trigger(Events.initComplete);
  }
};

module.exports = Context;
