var Events = require('../../context/events').events;
module.exports = function(model, eventBus) {
  eventBus.on(Events.basic.initNew, model.initBasic.bind(model));
  eventBus.on(Events.basic.autoSave, model.autoSave.bind(model));
  eventBus.on(Events.basic.initialState, model.iAmChanged.bind(model));
};
