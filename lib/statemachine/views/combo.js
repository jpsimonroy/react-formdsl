var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var Select = require('react-select');
var optionsFor = require('./lib').optionsFor;
var errorClass = require('./lib').errorClass;
var ComboFor = require('./combo_for');
var labelFn = require('./label');
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
    var label ;
		var fieldDisabled = classnames({
			'disabled': this.props.element.get('object').get('disabled')
		});
    if(this.props.element.get('object').get('show_label')){
      label  = labelFn(comboDef, this.props.element.get('object'), this.props.config);
    }
		return (
				<div className={`form-group control-container cukes-${this.props.element.get('object').get('id')}`}>
          {label}
					{comboDef}
					<div className={"validation " +  errorClass(this.props.element.get('element').get('valid'), this.props.element.get('object').get('show_validation'))}>
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
    var input;
		if(this.props.element.get('object').get('options') !== 'multi'){
			var value = this.props.element.get('element').get('value');
			var valueFoundInStore = _.any(store, e => e.id === value);
			if(!valueFoundInStore && !_.isEmpty(value)) this.changeValue(null, true);
			input =  ComboFor(store,
				value,
				changeHandler,
				this.props.element.get('object').get('label'),
				'id', element.get('key'), 
        this.props.config);
		} else {
			input  =  <Select options={optionsFor(store, element.get('key'))}
				placeholder={this.props.element.get('object').get('label')}
				value={this.props.element.get('element').get('value')} onChange={changeHandler}
				multi={this.props.element.get('object').get('options') === 'multi'}
				searchable={true}/>;

		}
    return input;
	},
	standAlone: function(changeHandler){
		var element = this.props.element.get('object');
		var propLookup = element.get('type') === 'local' ? this.props.local : this.props.masterStore;
		var lookupPath = element.get('lookup').split('.');
		var store = propLookup;
    var controlClass = this.props.config && this.props.config.classes ?
                        this.props.config.classes.control_class: '';
    if(this.props.element.get('object').get('disabled')){
      controlClass  += " disabled";
    }
		lookupPath.forEach(function(e){
			store = store[e];
		});
		var select = "";
		if(this.props.element.get('object').get('options') !== 'multi'){
			select = ComboFor(store,
				this.props.element.get('element').get('value'),
				changeHandler,
				this.props.element.get('object').get('label'),
				'id', element.get('key'), this.props.config,
         this.props.element.get('object') ,
          this.props.element.get('element'));
		}else{
			select = <div className={controlClass}>
      <Select options={optionsFor(store, element.get('key'))}
				placeholder={this.props.element.get('object').get('label')}
				value={this.props.element.get('element').get('value')}
				onChange={changeHandler} multi={this.props.element.get('object').get('options') === 'multi'}
				searchable={true}/>
      </div>;
		}
		return (
      <ElementsBasket name={this.props.element.get('object').get('id')}
      data={{
        element: this.props.element.get('element'),
        config: this.props.config }}>
        {select}
			</ElementsBasket>);
		}
});


module.exports = Combo;
