var Basic = require('./../basic/models/basic');
var BasicListeners = require('./../basic/models/listeners');
module.exports = function(localStorage, eventBus, registry) {
  registry.models = {
    basic: new Basic(eventBus, localStorage)
  };
  BasicListeners(registry.models.basic, eventBus);
};
