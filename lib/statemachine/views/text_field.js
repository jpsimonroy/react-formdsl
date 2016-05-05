var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var errorClass = require('./lib').errorClass;
var emptyClass = require('./lib').emptyClass;
var labelFn = require('./label');
var typeMapping = {
	text: "text",
	datetime: 'datetime-local',
	date: 'date'
};
var displayForDateTime = function(val, type){
	if(val && type === 'datetime'){
		return val.replace(' ', 'T');
	}
	return val;
};
var stateForDateTime = function(val, type){
	if(val && type === 'datetime'){
		return val.replace('T', ' ');
	}
	return val;
};
var TextField = React.createClass({
	getInitialState: function(){
		var that = this;
		return {
			value: displayForDateTime(that.props.element.get('element').get('value'), that.props.element.get('object').get('type'))
		};
	},

	componentWillReceiveProps: function(newProps){
		this.setState({
			value: displayForDateTime(newProps.element.get('element').get('value'), newProps.element.get('object').get('type'))
		});
	},
	valueChanged: function(evt){
		var val = evt.target.value === '' ? null : evt.target.value;
		val = stateForDateTime(val, this.props.element.get('object').get('type'));
		this.props.dataChangeHandler(this.props.element.get('object').get('id'), val);
	},
	onChange: function(evt){
		var type = typeMapping[this.props.element.get('object').get('type')] || "text";
		this.setState({
			value: evt.target.value
		});
		if(type !== 'text'){
			this.valueChanged(evt);
		}
	},
	render: function() {
		var type = typeMapping[this.props.element.get('object').get('type')] || "text";
		var id = this.props.element.get('object').get('id');
		var disabled = this.props.element.get('object').get('disabled');
		var input = (<div>
			            <label className="date">{this.props.element.get('object').get('label')}</label>
									<input type={type} placeholder={this.props.element.get('object').get('label')}
		              className={emptyClass(this.props.element.get('element').get('value')) + " mdl-textfield__input"}
		              onBlur={this.valueChanged} onChange={this.onChange} readOnly={disabled}
		              value={this.state.value}/>
								</div>);
		if(type === 'text'){
			input = (<textarea placeholder={this.props.element.get('object').get('label')}
	              className={`mdl-textfield__input ${emptyClass(this.props.element.get('element').get('value'))}`}
	              onBlur={this.valueChanged} onChange={this.onChange} readOnly={disabled}
	              rows={3} value={this.state.value}/>);
                  if(this.props.element.get('object').get('showLabel')){
                      input  = labelFn(input, this.props.element.get('object').get('label'));
                  }
		}
		if(disabled){
			input = (<div className='readonly-text-container'>
								<label>{this.props.element.get('object').get('label')}</label>
								<div className='readonly-text'>{this.state.value}</div>
							</div>);
		}

		return (
			<ElementsBasket name={this.props.element.get('object').get('id')}
				data={{element: this.props.element.get('element'), state: this.state.value,
								object: this.props.element.get('object')}}>
				<div style={{marginBottom: '10px'}} className={`cukes-${id} ${id}`}>
	        <div className="form-group">
	          {input}
	        </div>
					<div className="not-important tip">
            <span>{this.props.element.get('object').get('tip') || ''}</span>
          </div>
	        <div className={"validation " + errorClass(this.props.element.get('element').get('valid'))}>
	          <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
	          <span className="validation-msg">{this.props.element.get('element').get('messages').toJS().join(',')}</span>
	        </div>
        </div>
      </ElementsBasket>);
	}
});


module.exports = TextField;
