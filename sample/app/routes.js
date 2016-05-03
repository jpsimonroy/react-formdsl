var Router = require('director').Router;
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app.jsx');
var Events = require('./context/events').events;

var Routes = function() {
  var routes = {
    '/basic/:action': (action) => {
      window.routingOpts = {
        page: 'basic',
        action: action
      };
      propogateToTree();
    }
  };
  window.ROUTER = Router(routes);
  var propogateToTree = () => {
    ReactDOM.render(React.createElement(App, {}), document.getElementById('app'));
  };
  window.ROUTER.init('/basic/new');
};

module.exports = Routes;
