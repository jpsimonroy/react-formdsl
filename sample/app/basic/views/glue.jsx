var React = require('react');
var _ = require('underscore');
var NewBasic = require('./new_basic.jsx');
var Events = require('./../../context/events').events;
module.exports = function(components){
   components.push(<NewBasic eventRoot={Events.basic} key='new_basic'/>);
   return components;
};
