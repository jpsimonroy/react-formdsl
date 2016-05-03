var React = require('react');
var Events = require('./context/events').events;
// var BasicView = require('./basic/views/glue.jsx');

var App = React.createClass({
  render: function() {
    var components = [];
      // if (window.routingOpts.page === 'basic') {
      //   components = BasicView(components);
      // }
    }
    return (
      <div id="content" style={{height: '100%', width: '100%', overflowY: 'hidden', overflowX: 'hidden'}}>
        {components}
      </div>);
  }
});
module.exports = App;
