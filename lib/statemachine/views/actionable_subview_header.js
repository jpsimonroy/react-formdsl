var React = require('react');
var classnames = require('classnames');
var PureRenderMixin = require('react-addons-pure-render-mixin')

var ActionableSubViewHeader = React.createClass({
	mixins: [PureRenderMixin],
	save: function(){
		window.BUS.trigger(this.props.save);
	},
	render: function(){
		var disabled = !this.props.validations.get('model') || this.props.submitInProgress;
		var saveEnabled = classnames({
			'disabled': disabled
		});
		return (
			<div className="navbar-fixed-top nav-back">
				<div className="navbar navbar-menu">
					<div className="navbar-header" style={{width: '100%', zIndex: 2000}}>
						<div className='main-navicon-container'>
							<i className='main-navicon fa fa-arrow-left' onClick={this.props.goBack}/>
						</div>
						<div className='toolbar-container'>
							<div className="main-title">
								{this.props.header}
							</div>
							<div className='toolbar-actions'>
								<div className='toolbar-action-item'>
									<i className={`fa fa-save main-navicon ${saveEnabled}`}
											onClick={this.save}
											data-ga-category={(this.props.feature || '').replace(/\s/g, '_')}
											data-ga-action={`${this.props.header}::save`.replace(/\s/g, '_')}/>
									</div>
								</div>
						</div>
					</div>
				</div>
			</div>);
	}
});

module.exports = ActionableSubViewHeader;
