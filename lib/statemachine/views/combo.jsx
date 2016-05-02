var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket.jsx');
var Select = require('react-select');
var optionsFor = require('./lib.jsx').optionsFor;
var errorClass = require('./lib.jsx').errorClass;
var ComboFor = require('./combo_for.jsx');
var classnames = require('classnames');
var Combo = React.createClass({
	changeHandler: function(event){
		var value = (event && event.target) ? (_.isEmpty(event.target.value) ? null : event.target.value) : event;
		this.changeValue(value);
	},
	changeValue: function(value, defer){
		var f = e => { this.props.dataChangeHandler(this.props.element.get('object').get('id'), value); };
		if(defer){
		  _.defer(f);
		}else{
			f();
		}
	},
	render: function() {
		var comboDef = this.props.element.get('object').get('parent') ? this.dependant(this.changeHandler) : this.standAlone(this.changeHandler);
		var fieldDisabled = classnames({
			'disabled': this.props.element.get('object').get('disabled')
		});
		return (
				<div className={`form-group ${fieldDisabled}`}>
					{comboDef}
					<div className={"validation " +  errorClass(this.props.element.get('element').get('valid'))}>
	          <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
	          <span className="validation-msg">{this.props.element.get('element').get('messages').toJS().join(',')}</span>
	        </div>
				</div>
		);
	},
	dependant: function(changeHandler){
		var element = this.props.element.get('object');
		var propLookup = element.get('type') === 'local' ? this.props.local : this.props.masterStore;
		var lookupPath = element.get('lookup').split('.');
		var parentElement = this.props.elements.find(function(e){
			return element.get('parent') === e.get('object').get('id');
		});
		var store = propLookup;
		lookupPath.forEach(function(e){
			store = store[e];
		});
		if (parentElement && parentElement.get('element').get('value')) {
		  store = _.filter(store, function(e) {
		    if (Array.isArray(e[element.get('filter_key')])) {
		      return _.some(e[element.get('filter_key')], f => {
		        return String(f) === String(parentElement.get('element').get('value'));
		      });
		    } else {
		      return String(e[element.get('filter_key')]) === String(parentElement.get('element').get('value'));
		    }
		  });
		}
		if(this.props.element.get('object').get('options') !== 'multi'){
			var value = this.props.element.get('element').get('value');
			var valueFoundInStore = _.any(store, e => e.id === value);
			if(!valueFoundInStore && !_.isEmpty(value)) this.changeValue(null, true);
			return ComboFor(store,
				value,
				changeHandler,
				this.props.element.get('object').get('label'),
				'id', element.get('key'));
		} else {
			return <Select options={optionsFor(store, element.get('key'))}
				placeholder={this.props.element.get('object').get('label')}
				value={this.props.element.get('element').get('value')} onChange={changeHandler}
				multi={this.props.element.get('object').get('options') === 'multi'}
				searchable={true}/>;
		}
	},
	standAlone: function(changeHandler){
		var element = this.props.element.get('object');
		var propLookup = element.get('type') === 'local' ? this.props.local : this.props.masterStore;
		var lookupPath = element.get('lookup').split('.');
		var store = propLookup;
		lookupPath.forEach(function(e){
			store = store[e];
		});
		var select = "";
		if(this.props.element.get('object').get('options') !== 'multi'){
			select = ComboFor(store,
				this.props.element.get('element').get('value'),
				changeHandler,
				this.props.element.get('object').get('label'),
				'id', element.get('key'));
		}else{
			select = <Select options={optionsFor(store, element.get('key'))}
				placeholder={this.props.element.get('object').get('label')}
				value={this.props.element.get('element').get('value')}
				onChange={changeHandler} multi={this.props.element.get('object').get('options') === 'multi'}
				searchable={true}/>;
		}
		return (
			<ElementsBasket name={this.props.element.get('object').get('id')}
					data={this.props.element.get('element')}>
				{select}
			</ElementsBasket>);
		}
});


module.exports = Combo;
