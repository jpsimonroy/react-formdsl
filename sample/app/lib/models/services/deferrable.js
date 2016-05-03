var Immutable = require('immutable');
var $ = require('jquery');
var moment = require('moment');
var AppDefaults = require('./../../app_defaults');
var App = require('./../../../context/events');

var Deferrable = function(clazz, cacheDisabled, showError) {
  return {
    get: function(query, callback) {
      return this._resource(this.path, query, Immutable.fromJS, callback);
    },
    index: function(query, callback) {
      return this._resource(this.searchPath, query, Immutable.fromJS, callback);
    },
    indexAt: function(path, query, callback) {
      return this._resource(path, query, Immutable.fromJS, callback);
    },
    _init: function(path, value) {
      this._resultTicker = this._resultTicker || {};
      this._resultTicker[path] = value;
      clazz._cache = clazz._cache || {};
    },
    _flushCache: function(){
      clazz._cache = {};
    },
    _cacheKey: function(path, query) {
      var cacheSuffix = ':' + moment().format('DDMMYYYYTHH');
      if(this.__cacheSuffix) {
        cacheSuffix = ':' + this.__cacheSuffix();
      }
      return path + ':' + JSON.stringify(query) + cacheSuffix;
    },
    _withCallback: function(callback, data) {
      return callback ? callback.bind(this)(data) : data;
    },
    _resource: function(path, query, sealer, callback) {
      var that = this;
      var deferred = $.Deferred();
      var cacheKey = this._cacheKey(path, query);
      this._init(path, cacheKey);
      var fromCache = clazz._cache[cacheKey];
      if (!cacheDisabled && fromCache) {
        deferred.resolve(sealer(this._withCallback(callback, fromCache)));
      } else {
        var startTime = new Date();
        $.ajax({
          url: window.apiContext + path,
          data: query,
          dataType: 'json'
        }).done(function(data) {
          clazz._cache[that._cacheKey(path, query)] = data;
          if (that._resultTicker[path] === cacheKey) {
            deferred.resolve(sealer(that._withCallback(callback, data)));
          } else {
            deferred.reject("Slow Request ignored");
          }
        }).fail(function(jqXHR, textStatus, errorThrown) {
          console.log(JSON.stringify(jqXHR));
          if(showError){
            var message = null;
            if (jqXHR.status === 0 && errorThrown !== 'canceled') {
        			message = 'Unable reach the server. Please check your internet connection.';
        		}
            if (that._resultTicker[path] === cacheKey)
              window.BUS.trigger(App.events.ui.alert,
                  [message || AppDefaults.errorText(jqXHR), 'Error']);
          }
          deferred.reject(errorThrown);
        }).always(() => {
          var timeInMills = new Date().getTime() - startTime.getTime();
          GoogleAnalytics.trackTiming(path, timeInMills);
        });
      }
      return deferred;
    }
  };
};
module.exports = Deferrable;
