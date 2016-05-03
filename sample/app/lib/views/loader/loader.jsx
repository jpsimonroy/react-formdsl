var React = require('react');
var classnames = require('classnames');

var Loader = React.createClass({
  render: function() {
    var smallImg = classnames({'small': this.props.small});
    return (
      <div className="mdl-loader">
        <img src='svg_loaders/puff.svg' className={smallImg}/>
      </div>);
  }
});

module.exports = Loader;
