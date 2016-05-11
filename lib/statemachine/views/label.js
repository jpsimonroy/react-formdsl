import React from 'react';
module.exports = function(component, label, config){
  var classname = config && config.classes ? config.classes.label_class: '';
  return <label className={classname}>{label}</label> ;
       
};

