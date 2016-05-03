var React = require('react');
var Loader = require('./../../lib/views/loader/loader.jsx');
var ModelMux = require('./../../lib/views/multiplux/modelmux.jsx');
var Container = require('./../../../../lib/index').Container;
var Events = require('./../../context/events').events;
var _ = require('underscore');
var Immutable = require('immutable');
var NewBasic = React.createClass({
	mixins: [ModelMux],
  withModels: ["basic"],
	componentDidMount: function(){
		window.BUS.trigger(Events.basic.initNew);
	},
	render: function(){
		var body = <div/>;
		var loading = this.state.basic ? this.state.basic.get("digest").get("actionable").get('loading') : false;
		var actionable = this.state.basic ? this.state.basic.get('digest').get('actionable') : null;
		debugger;
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
				</div>
			</div>);
	}
});

module.exports = NewBasic;
