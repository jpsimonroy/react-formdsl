var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket.jsx');
var errorClass = require('./lib.jsx').errorClass;
var IconRating = require('react-icon-rating');
var getValue = function (val) {
  if (!val)
    return 0;
  return Number(val);
};
var Rating = React.createClass({
  shouldComponentUpdate: function(newProps){
    return !_.isEqual(newProps.element, this.props.element);
  },
  onRating: function (rating) {
    this.props.dataChangeHandler(this.props.element.get('object').get('id'),
              String(rating));
  },
  render: function () {
    var element = this.props.element.get('object');
    var primaryIcon = (
      <div className={`rating-primary ${element.get('primary') ? '' : 'hidden'}`}>
        <i className="fa fa-hand-peace-o"/>
      </div>);
    return (
      <ElementsBasket data={this.props.element}
          name={this.props.element.get('object').get('id')}>
        <div className={`form-group cukes-${element.get('id')}`}>
          {primaryIcon}
          <div className='rating-label'>
            {this.props.element.get('object').get('label')}
          </div>
          <div className='ticket-rating-component'>
            <IconRating key={(new Date()).getTime()} toggledClassName="fa fa-star" untoggledClassName="fa fa-star-o"
                  onChange={this.onRating} currentRating={getValue(this.props.element.get('element').get('value'))} />
          </div>
          <div className={`${element.get('primary') ? 'hidden' : ''} validation ${errorClass(this.props.element.get('element').get('valid'))}`}>
            <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
            <span className="validation-msg">{this.props.element.get('element').get('messages').toJS().join(',')}</span>
          </div>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = Rating;
