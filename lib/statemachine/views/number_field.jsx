var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket.jsx');
var errorClass = require('./lib.jsx').errorClass;
var emptyClass = require('./lib.jsx').emptyClass;
var round = function(val) {
  if (val) {
    return Math.round(val);
  }
  return val;
};

var NumberField = React.createClass({
  getInitialState: function() {
    var that = this;
    return {
      value: round(that.props.element.get('element').get('value'))
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      value: round(newProps.element.get('element').get('value'))
    });
  },
  valueChanged: function(evt) {
    var val = evt.target.value === '' ? null : String(round(String(evt.target.value)));
    this.props.dataChangeHandler(this.props.element.get('object').get('id'), val);
  },
  onChange: function(evt) {
    this.setState({
      value: evt.target.value
    });
  },
  render: function() {
    var id = this.props.element.get('object').get('id');
    var input = (
      <input className={emptyClass(this.props.element.get('element').get('value')) + " form-control"}
				onBlur={this.valueChanged} onChange={this.onChange}
				placeholder={this.props.element.get('object').get('label')}
				type='number' value={this.state.value}/>
    );
    return (
      <ElementsBasket data={{element: this.props.element.get('element'), state: this.state.value}}
					name={this.props.element.get('object').get('id')}>
        <div style={{marginBottom: '10px'}} className={`cukes-${id}`}>
          <div className="form-group">
            {input}
          </div>
          <div className="not-important tip">
            <span>{this.props.element.get('object').get('tip') || ''}</span>
          </div>
          <div className={"validation " + errorClass(this.props.element.get('element').get('valid'))}>
            <span><i className="mdi-alert-error"/></span>
            <span className="validation-msg">
              {this.props.element.get('element').get('messages').toJS().join(',')}</span>
          </div>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = NumberField;
