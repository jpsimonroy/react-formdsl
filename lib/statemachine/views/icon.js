var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var errorClass = require('./lib').errorClass;
var Icon = React.createClass({
  shouldComponentUpdate: function(newProps){
    return false;
  },
  render: function () {
    var element = this.props.element.get('object');
    var icon = this.props.element.get('object').get('icon') || 'commenting';
    var primaryIcon = (
      <div className='rating-primary'>
        <i className={`fa fa-${icon}`}
              style={{color: 'orange'}}/>
      </div>);
    return (
      <ElementsBasket data={this.props.element}
          name={this.props.element.get('object').get('id')}>
        <div className={`form-group cukes-${element.get('id')}`}>
          {primaryIcon}
          <div className='rating-label'>
            {this.props.element.get('object').get('label')}
          </div>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = Icon;
