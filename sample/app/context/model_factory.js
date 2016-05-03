var Basic = require('./../basic/models/basic');
module.exports = function(localStorage, eventBus, registry) {
  var loginModel = new Login(eventBus, localStorage);
  registry.models = {
    basic: new Basic(eventBus, localStorage)
  };
  BasicListeners(registry.models.basic, eventBus);
};
