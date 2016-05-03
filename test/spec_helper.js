var jsdom = require('jsdom').jsdom;
document = jsdom('<html><head><script></script></head><body></body></html>');
window = document.defaultView;
window.apiContext = "http://localhost:4557";
navigator = window.navigator = {};
navigator.userAgent = 'NodeJs JsDom';
navigator.appVersion = '';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var $ = require("jquery");
$.support.cors = true;
$.ajaxSettings.xhr = function() {
  return new XMLHttpRequest();
};
