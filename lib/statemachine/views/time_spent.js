var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var errorClass = require('./lib').errorClass;
var emptyClass = require('./lib').emptyClass;
var TimeSpent = React.createClass({
	componentWillReceiveProps: function(newProps) {
		this.setState(this.withState(newProps.element.get('element').get('value')));
	},
	getInitialState: function() {
		var timespent = this.props.element.get('element').get('value');
		return this.withState(timespent);
	},
	withState: function(timespent) {
		var hours = timespent ? Math.floor(timespent / 60) : '';
		var mins = timespent ? timespent % 60 : '';
		return {
			hours: (hours > 0) ? hours : '',
			mins: (mins > 0) ? mins : ''
		};
	},
	onChange: function() {
		var mins = this.state.mins || 0;
		mins += (this.state.hours || 0) * 60;
		this.props.dataChangeHandler(this.props.element.get('object').get('id'), String(mins));
	},
	hoursChanged: function(evt) {
		if(_.isEmpty(evt.target.value)){
			this.setState(_.defaults({
				hours: null
			}, this.state));
			return;
		}
		var hours = Number(evt.target.value);
		if (String(hours) === evt.target.value && hours > 0) {
			this.setState(_.defaults({
				hours: hours
			}, this.state));
		}
	},
	minsChanged: function(evt) {
		if(_.isEmpty(evt.target.value)){
			this.setState(_.defaults({
				mins: null
			}, this.state));
			return;
		}
		var mins = Number(evt.target.value);
		if (String(mins) === evt.target.value && mins > 0) {
			this.setState(_.defaults({
				mins: mins
			}, this.state));
		}
	},
	render: function() {
		return (
			<ElementsBasket name={this.props.element.get('object').get('id')} data={{elem: this.props.element.get('element'), state: this.state}}>
				<div style={{marginBottom: '10px'}}>
	        <div className="form-control-wrapper">
		        <span className="not-important" style={{marginRight: '15px'}}>{this.props.element.get('object').get('label')}:</span>
	          <input type='number' placeholder='hrs' value={this.state.hours} onChange={this.hoursChanged} onBlur={this.onChange}
	              className={emptyClass(this.props.element.get('element').get('value')) + " form-control time-taken"}/>
            <input type='number' placeholder='mins' value={this.state.mins} onChange={this.minsChanged} onBlur={this.onChange}
	              className={emptyClass(this.props.element.get('element').get('value')) + " form-control time-taken"}/>
	        </div>
	        <div className={"validation " + errorClass(this.props.element.get('element').get('valid'))}>
	          <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
	          <span className="validation-msg">{this.props.element.get('element').get('messages').toJS().join(',')}</span>
	        </div>
        </div>
      </ElementsBasket>);
	}
});


module.exports = TimeSpent;
