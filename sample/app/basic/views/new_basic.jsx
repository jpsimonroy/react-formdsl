var React = require('react');
var Loader = require('./../../lib/views/loader/loader.jsx');
var ModelMux = require('./../../lib/views/multiplux/modelmux.jsx');
var Container = require('react-formdsl').Container;
var Events = require('./../../context/events').events;
var _ = require('underscore');
var Immutable = require('immutable');
var classnames = require('classnames');
var NewBasic = React.createClass({
	mixins: [ModelMux],
  withModels: ["basic"],
	componentDidMount: function(){
		window.BUS.trigger(Events.basic.initNew);
	},
	save: function(){
		window.BUS.trigger(Events.basic.takeAction);
	},
	render: function(){
		var body = <div/>;
		var loading = this.state.basic ? this.state.basic.get("digest").get("actionable").get('loading') : false;
		var actionable = this.state.basic ? this.state.basic.get('digest').get('actionable') : null;
		var disabled = actionable ? (!actionable.get('validations').get('model') || loading) : true;
		var saveEnabled = classnames({
			'disabled': disabled
		});
		if(actionable){
			body = (<Container key='dummy_basic'
								eventRoot={this.props.eventRoot}
								formElements={actionable.get('formElements')}
								validations={actionable.get('validations')}
								localMaster={(actionable.get('local') || Immutable.fromJS({})).toJS()}
								masterStore={this.props.masterStore || {}}/>);
		}
		return (
			<div>
				<div className='app-content form_dsl'>
					<div className={!loading ? 'hidden': ''}>
            <Loader/>
          </div>
					{body}
					<i className={`fa fa-save ${saveEnabled}`}
							style={{fontSize: '2rem', margin: '0 0.2rem 0 1rem'}} onClick={this.save}/>
					<span className={saveEnabled} style={{fontSize: '1.5rem'}} onClick={this.save}>Save</span>
				</div>
			</div>);
	}
});

module.exports = NewBasic;
