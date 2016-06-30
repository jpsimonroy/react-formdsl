import React from 'react';
module.exports = function(component, object, config){
  var classname ;
  if(object.get('label_class')){
    classname = object.get('label_class');
  }else{
    classname = config && config.classes ? config.classes.label_class: '';
  }
  return <label className={classname}>{object.get('label')}</label> ;
       
};

