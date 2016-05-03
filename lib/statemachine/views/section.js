var _ = require('underscore');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin')
var ElementsBasket = require('./elements_basket');
var classnames = require('classnames');

var Section = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState: function() {
		return {
			expanded: this.props.expanded
		};
	},
	toggleExpansion: function(){
		var toggledState = !this.state.expanded;
		this.setState({
			expanded: toggledState
		});
	},
	render: function(){
		var validation = this.props.validation;
		var showControl =  classnames({
			'glyphicon glyphicon-chevron-up': this.state.expanded,
			'glyphicon glyphicon-chevron-down': !this.state.expanded
		});
		var showContent =  classnames({
			'hidden': !this.state.expanded
		});
		var errorClass = classnames({
			'hidden': !this.props.validation || this.props.validation.get('valid')
		});
		return (
			<div className="panel panel-default">
			  <div className="panel-heading" onClick={this.toggleExpansion}>
			    <div className="panel-title">
			    	<span>{this.props.tag}</span>
			    	<span style={{float:'right'}}>
							<div className={showControl} ariaHidden={true}/>
						</span>
			    </div>
			  </div>
			  <div className={"panel-body " + showContent}>
			  	{this.props.children}
			  	<ElementsBasket name='validation' data={this.props.validation || ''}>
							<div className={"validation " + errorClass}>
	              <span><i className="validation fa fa-exclamation-circle form-icon"/></span>
	              <span className="validation-msg">{validation ? validation.get('message') : ''}</span>
        			</div>
      			</ElementsBasket>
			  </div>
		  </div>);
	}
});

module.exports = Section;
