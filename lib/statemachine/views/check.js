var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var Immutable = require('immutable');
var errorClass = require('./lib').errorClass;
var getValue = function (val) {
  if (!val)
    return false;
  return Number(val);
};
var Check = React.createClass({
  shouldComponentUpdate: function(newProps){
    return !_.isEqual(newProps.element, this.props.element);
  },
  onCheckChanged: function (val, evt) {
    var values = (this.props.element.get('element').get('value') || Immutable.fromJS([])).toJS();
    if(evt.target.checked) {
      values.push(val);
    } else {
      values = _.without(values, val);
    }
    this.props.dataChangeHandler(this.props.element.get('object').get('id'), values);
  },
  render: function () {
    var element = this.props.element.get('object');
    var propLookup = element.get('type') === 'local' ? this.props.local : this.props.masterStore;
    var lookupPath = element.get('lookup').split('.');
    var store = propLookup;
    var that = this;
		lookupPath.forEach(function(e){
			store = store[e];
		});
    var values = (that.props.element.get('element').get('value') || Immutable.fromJS([])).toJS();
    var options = _.map(store, function(s){
      return (
        <label>
          <input checked={_.contains(values, s.id)}
              name={s.id} onChange={that.onCheckChanged.bind(that, s.id)}
              type="checkbox"/>
          <div className='option-text'>{s.name}</div>
        </label>);
    });
    return (
      <ElementsBasket data={this.props.element} name={this.props.element.get('object').get('id')}>
        <div className={`form-group cukes-${element.get('id')}`}>
          <div className='search-section'>
            {that.props.element.get('object').get('label')}
          </div>
          {options}
          <div className={"validation " +  errorClass(this.props.element.get('element').get('valid'))}>
            <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
            <span className="validation-msg">{this.props.element.get('element').get('messages').toJS().join(',')}</span>
          </div>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = Check;
