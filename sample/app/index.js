var $ = require('jquery');
var _ = require('underscore');
var Router = require('director').Router;
var localStorage = require('localStorage');
var Context = require('./context/context');
var Events = require('./context/events').events;
var React = require('react');
var ReactDOM = require('react-dom');
var Routes = require('./routes.js');
window.apiContext = process.env.API_CONTEXT_URI;
$(() => {
  var bus = $({});
  window.BUS = bus;
  window.BUS.on(Events.ui.route, (evt, route) => {
    window.ROUTER.setRoute(route);
  });
  window.BUS.on(Events.ui.alert, function(evt, msg, title, callback, buttonLabel = null) {
    if (_.isEmpty(msg)) {
      return;
    }
    title = title || 'Info';
    callback = callback || null;
    if(navigator.notification){
      navigator.notification.alert(msg, callback, title, buttonLabel);
    }else if(alert){
      alert(msg);
    }
    if (!navigator.notification && callback) {
      callback();
    }
  });

  window.BUS.on(Events.ui.confirm, function(evt, msg, title, callback) {
    title = title || 'Confirm your action';
    callback = callback || null;
    var onDevice = function() {
      navigator.notification.confirm(msg, function(index) {
        if (index === 1) callback();
      }, title, ['OK', 'Cancel']);
    };
    var onWeb = function() {
      if(!confirm) return;
      var res = confirm(msg);
      if (res) {
        callback();
      }
    };
    navigator.notification ? onDevice() : onWeb();
  });

  window.BUS.on(Events.initComplete, function(event) {
    Routes();
  });

  window.BUS.on(Events.goBack, function(event) {
    window.history.back();
  });
  setTimeout(() => {
    console.log('Initializing Context from SetTimeOut');
    new Context(window.BUS, localStorage);
  }, 0);
});
