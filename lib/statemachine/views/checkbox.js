var _ = require('underscore');
var React = require('react');
var ElementsBasket = require('./elements_basket');
var getValue = function (val) {
  if (!val)
    return false;
  return Number(val)>0;
};
var Check = React.createClass({
  onCheckBoxChanged: function (evt) {
    this.props.dataChangeHandler(this.props.element.get('object').get('id'), evt.target.checked ? "1" : "0");
  },
  render: function () {
    var id = this.props.element.get('object').get('id');
    var readonly = this.props.config.readonly;
    var value = getValue(this.props.element.get('element').get('value'));
    var input, readonlyLabel, labelClass, controlClass;

    var object = this.props.element.get('object');
    if(object.get('label_class')){
      labelClass = object.get('label_class');
    }
    if(this.props.config.classes.control_class){
      controlClass = object.get('control_class');
      controlClass = this.props.config.classes.control_class;
    }

    if(_.isEmpty(labelClass)){
      if(this.props.config.classes.label_class){
        labelClass = this.props.config.classes.label_class;
      }
    }
    if(_.isEmpty(controlClass)){
      if(this.props.config.classes.control_class){
        controlClass = this.props.config.classes.control_class;
      }
    }
    if(readonly){
      readonlyLabel = <span>{value ? "Yes": "No"}</span>;
      labelClass = "col-md-5 col-xs-5 col-sm-5";
      controlClass = "col-md-2 col-xs-2 col-sm-2";
    }else{
      input = <input onChange={this.onCheckBoxChanged}  disabled={readonly} checked={value} style={{float: 'left', 'marginRight': '1rem'}} type="checkbox"/>;
    }
    return (
      <ElementsBasket data={{
        element: this.props.element,
        config: this.props.config
        }} name={this.props.element.get('object').get('id')}>
        <div className={`form-group cukes-${id}`}>
          <label style={{paddingLeft: '0.5rem'}} className={labelClass}>
            {input}
            {this.props.element.get('object').get('label')}
          </label>
          <div className={controlClass} >
           {readonlyLabel}
           </div>
        </div>
      </ElementsBasket>
    );
  }
});

module.exports = Check;
