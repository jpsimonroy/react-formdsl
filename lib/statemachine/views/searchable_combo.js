var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var Select = require('react-select');
var optionsFor = require('./lib').optionsFor;
var errorClass = require('./lib').errorClass;
var classnames = require('classnames');
var Combo = React.createClass({
	changeHandler: function(value, defer){
		if(value === '')
			value = null;
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
		var propLookup = element.get('lookup_from') === 'local' ? this.props.local : this.props.masterStore;
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
		var value = this.props.element.get('element').get('value');
		var multi = this.props.element.get('object').get('options') === 'multi';
		if(!multi){
			var valueFoundInStore = _.any(store, e => e.id === value);
			if(!valueFoundInStore && !_.isEmpty(value)) this.changeHandler(null, true);
		}
		return (
			<Select options={optionsFor(store, element.get('key'))}
				placeholder={this.props.element.get('object').get('label')}
				value={value}
				onChange={changeHandler} multi={multi}
				searchable={true}/>);
	},
	standAlone: function(changeHandler){
		var element = this.props.element.get('object');
		var propLookup = element.get('lookup_from') === 'local' ? this.props.local : this.props.masterStore;
		var lookupPath = element.get('lookup').split('.');
		var store = propLookup;
		lookupPath.forEach(function(e){
			store = store[e];
		});
		return (
			<ElementsBasket name={this.props.element.get('object').get('id')}
					data={this.props.element.get('element')}>
				<Select options={optionsFor(store, element.get('key'))}
					placeholder={this.props.element.get('object').get('label')}
					value={this.props.element.get('element').get('value')}
					onChange={changeHandler} multi={this.props.element.get('object').get('options') === 'multi'}
					searchable={true}/>
			</ElementsBasket>);
		}
});


module.exports = Combo;
