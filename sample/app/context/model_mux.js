var Events = require('./events').events;

var Multipluxer = class {
  eventIdentifier(){
    return `${Events.models.changed}::${this.identifier}`;
  }
  iAmChanged() {
    if (!this.identifier) {
      throw new TypeError('Model should define a Multipluxer');
    }
    this.eventBus.trigger(`${Events.models.changed}::${this.identifier}`, [this.getState()]);
  }
};

module.exports = Multipluxer;
