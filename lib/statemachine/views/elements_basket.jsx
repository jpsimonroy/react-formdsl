var React = require('react');
var _ = require('underscore');

var ElementsBasket = React.createClass({
  shouldComponentUpdate: function(newProps) {
    return !_.isEqual(newProps.data, this.props.data) || newProps.className !== this.props.className;
  },
  render: function() {
    return this.props.children;
  }
});

module.exports = ElementsBasket;
