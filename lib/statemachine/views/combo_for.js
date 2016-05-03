var _ = require('underscore');
var React = require('react');
module.exports = function(options, selectedVal = '',
			changeHandler, placeholder='Select a value', id='id', name='name'){
	if(_.isEmpty(selectedVal)) selectedVal = '';
  options = _.clone(options || []);
	var helpText = {};
	helpText[id] = '';
	helpText[name]=placeholder;
	options.unshift(helpText);
  var selectOptions = _.map(options, (o, index) => {
    return (<option key={`option-${index}-${o[id]}`} value={o[id]}>{o[name]}</option>);
  });
	var styles = {};
	if(selectedVal === ''){
		styles['color'] = '#888';
	}
  return (
    <select value={selectedVal}
			style={styles}
			onChange={changeHandler}
			className="mdl-textfield__input">
      {selectOptions}
    </select>);
};
