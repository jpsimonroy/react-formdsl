var Events = require('../../../context/events').events;
var _ = require('underscore');
var Immutable = require('immutable');
var ModelMux = {
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    if (!this.withModels || _.isEmpty(this.withModels)) {
      return;
    }
    this.modelListeners = _.map(this.withModels, l => {
      var handler = (evt, modelState) => {
        var muxedState = {};
        muxedState[l] = modelState;
        if (this.shouldModelChangePropogate) {
          var propogationRequired = this.shouldModelChangePropogate(modelState);
          if (!propogationRequired)
            return;
        }
        this.setState(_.defaults(muxedState, this.state));
      };
      handler = handler.bind(this);
      window.BUS.on(`${Events.models.changed}::${l}`, handler);
      return {
        handler: handler,
        type: `${Events.models.changed}::${l}`
      };
    });
  },
  componentWillUnmount: function() {
    if (this.modelListeners && !_.isEmpty(this.modelListeners)) {
      _.each(this.modelListeners, l => {
        window.BUS.unbind(l.type, l.handler);
      });
    }
  }
};

module.exports = ModelMux;
