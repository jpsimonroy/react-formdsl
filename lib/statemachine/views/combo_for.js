var _ = require('underscore');
var React = require('react');
module.exports = function(options, selectedVal = '',
			changeHandler, placeholder='Select a value', id='id', name='name', config,
      object, element){
	if(_.isEmpty(selectedVal)) selectedVal = '';
  options = _.clone(options || []);
	var helpText = {};
	helpText[id] = '';
	helpText[name]=placeholder;
	options.unshift(helpText);
  var controlClass = config && config.classes ?
                      config.classes.control_class: '';
  var selectControl ;
  var styles = {};
  if(selectedVal === '' ){
    styles['color'] = '#888';
  }
  if(element.get('changed')){
    styles['color'] = '#f0ad4e';
  }
  if(config.readonly){
    var option = _.find(options, {id: Number(selectedVal)});
    if(option){
      selectControl  = <label>
      {option.name || option.label}
      </label>;
    }
  }else{
    var selectOptions = _.map(options, (o, index) => {
      return (<option key={`option-${index}-${o[id]}`} value={o[id]}>
              {o[name]}
              </option>);
    });
    selectControl = <select 
      value={selectedVal}
      style={styles}
      onChange={changeHandler}
      className="form-control">
      {selectOptions}
    </select>;
  }
  return (
    <div className={controlClass}>
      {selectControl}
    </div>);
};
