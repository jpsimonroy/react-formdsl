var React = require('react');
var FormFieldFactory = require('./form_field_factory');
var Section = require('./section');

var Container = React.createClass({
	render: function(){
		return (
			<div className="take-action">
				{new FormFieldFactory(this.props.masterStore, this.props.localMaster, this.props.eventRoot, this.props.routingOpts)
						.formFor(this.props.formElements, this.props.validations)}
			</div>);
	}
});

module.exports = Container;
