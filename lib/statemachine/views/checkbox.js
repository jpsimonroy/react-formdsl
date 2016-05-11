var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var getValue = function (val) {
  if (!val)
    return false;
  return Number(val);
};
var Check = React.createClass({
  onCheckBoxChanged: function (evt) {
    this.props.dataChangeHandler(this.props.element.get('object').get('id'), evt.target.checked ? "1" : "0");
  },
  render: function () {
    var id = this.props.element.get('object').get('id');
    return (
      <ElementsBasket data={this.props.element} name={this.props.element.get('object').get('id')}>
        <div className={`form-group cukes-${id}`}>
          <label style={{paddingLeft: '0.5rem'}}>
            <input onChange={this.onCheckBoxChanged} selected={getValue(this.props.element.get('element').get('value'))} style={{float: 'left'}} type="checkbox"/>
            <div style={{marginLeft: '1.5rem', paddingTop: '0.25rem'}}>{this.props.element.get('object').get('label')}</div>
          </label>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = Check;
