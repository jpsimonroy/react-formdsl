var _ = require('underscore');
var React = require('react');
var Combo = require('./combo');
var SearchableCombo = require('./searchable_combo');
var Check = require('./checkbox');
var TextField = require('./text_field');
var NumberField = require('./number_field');
var TimeSpent = require('./time_spent');
var Radio = require('./radio');
var Checkbox = require('./check');
var Rating = require('./rating');
var Icon = require('./icon');
var Section = require('./section');
var Immutable = require('immutable');
var classnames = require('classnames');
var mapping = {
	"master": Combo,
	"local": Combo,
	"searchable-combo": SearchableCombo,
	"boolean": Check,
	"text": TextField,
	"time_spent": TimeSpent,
	"date": TextField,
	"datetime": TextField,
	"radio": Radio,
	"checkbox": Checkbox,
	'number': NumberField,
	'rating': Rating,
	'icon': Icon,
	'escalate_marker': Icon
};
var getElementForKey = function(type, options){
	if(_.contains(['radio', 'checkbox'], options)){
		return mapping[options];
	}
	return mapping[type];
};
var FormFieldFactory = function(masterStore, local, eventRoot, routingOpts={}, plugins= {}){
  mapping = _.extend(mapping, plugins);
	return {
		routingOpts: routingOpts,
		dataChangeHandler: function(element, value){
			window.BUS.trigger(eventRoot.autoSave, [element, value]);
		},
		_elementFor: function(element, elements, config) {
			var that = this;
			return React.createElement(getElementForKey(element.get('object').get('type'),
									element.get('object').get('options')), {
				key: element.get('object').get('id'),
        _key: element.get('object').get('id'),
				element: element,
				elements: elements,
				masterStore: masterStore,
				local: local,
				dataChangeHandler: that.dataChangeHandler,
        config:  config
			});
		},

		_sectionFor: function(tag, elements, validations, key){
			var that = this;
			var sectionBody =  elements.map(function(e, index){
				return that._elementFor(e, elements);
			});
			return (
				<Section key={key} tag={tag} validation={validations.get('groupValidations').get(tag)} expanded={true}>
					{sectionBody}
				</Section>);
		},

		formFor: function(elements, validations, config){
			var that = this;
			var withOrder = [];
			var taglessElements = elements.filter(function(e){
				return _.isEmpty(e.get('object').get('tag'));
			}).map(function(e){
				return Immutable.fromJS({type: 'element', value: e, index: e.get('index')});
			});
			var sections = [];
      var formConfig = 
			elements.filter(e => !_.isEmpty(e.get('object').get('tag')))
					.groupBy(v => v.get('object').get('tag'))
					.map(function(v,k){
						sections.push(Immutable.fromJS({type: 'section', key: k, value: v, index: v.get(0).get('index')}));
					});
			var allElements = Immutable.fromJS(sections).concat(taglessElements).sortBy(a => a.get('index'));
			var formBody = allElements.map((e, index) => e.get('type') === 'section' ?
                        that._sectionFor(e.get('key'), e.get('value'), validations, 'section-' + index) :
                        that._elementFor(e.get('value'), [e.get('value')], config ? config.toJS()  : null));

      var formClasses = {};
      if(config && config.get('style')){
        formClasses[config.get('style')] = true;
      }

			return <form className={classnames(formClasses)}>
					{formBody}
				</form>;
		}
	};
};

module.exports = FormFieldFactory;
