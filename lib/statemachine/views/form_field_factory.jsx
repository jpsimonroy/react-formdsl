var _ = require('underscore');
var React = require('react');
var Combo = require('./combo.jsx');
var SearchableCombo = require('./searchable_combo.jsx');
var Check = require('./checkbox.jsx');
var TextField = require('./text_field.jsx');
var NumberField = require('./number_field.jsx');
var TimeSpent = require('./time_spent.jsx');
var Radio = require('./radio.jsx');
var Checkbox = require('./check.jsx');
var Rating = require('./rating.jsx');
var Icon = require('./icon.jsx');
var Section = require('./section.jsx');
var Immutable = require('immutable');
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
var FormFieldFactory = function(masterStore, local, eventRoot, routingOpts={}){
	return {
		routingOpts: routingOpts,
		dataChangeHandler: function(element, value){
			window.BUS.trigger(eventRoot.autoSave, [element, value]);
		},
		_elementFor: function(element, elements) {
			var that = this;
			return React.createElement(getElementForKey(element.get('object').get('type'),
									element.get('object').get('options')), {
				key: element.get('object').get('id'),
				element: element,
				elements: elements,
				masterStore: masterStore,
				local: local,
				dataChangeHandler: that.dataChangeHandler
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

		formFor: function(elements, validations){
			var that = this;
			var withOrder = [];
			var taglessElements = elements.filter(function(e){
				return _.isEmpty(e.get('object').get('tag'));
			}).map(function(e){
				return Immutable.fromJS({type: 'element', value: e, index: e.get('index')});
			});
			var sections = [];
			elements.filter(e => !_.isEmpty(e.get('object').get('tag')))
					.groupBy(v => v.get('object').get('tag'))
					.map(function(v,k){
						sections.push(Immutable.fromJS({type: 'section', key: k, value: v, index: v.get(0).get('index')}));
					});
			var allElements = Immutable.fromJS(sections).concat(taglessElements).sortBy(a => a.get('index'));
			var formBody = allElements.map((e, index) => e.get('type') === 'section' ? that._sectionFor(e.get('key'), e.get('value'), validations, 'section-' + index) : that._elementFor(e.get('value'), [e.get('value')]));
			return (
				<form>
					{formBody}
				</form>);
		}
	};
};

module.exports = FormFieldFactory;
