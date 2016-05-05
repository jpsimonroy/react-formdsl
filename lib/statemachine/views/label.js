import React from 'react';
module.exports = function(component, label){
  return <div>
             <label>{label}</label>
             {component}
         </div>;
};

