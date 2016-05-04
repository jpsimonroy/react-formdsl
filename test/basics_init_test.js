"use strict";
require('./spec_helper');
var should = require('should');
var FormStateMachine = require('./../lib/index').FormStateMachine;
var $ = require('jquery');
describe('Initialize and build', () => {
  it('should invoke the get endpoint and build the statemachine', done => {
    var Context = class {
      constructor(){
        this.state = {
          digest: {
            actionable: null
          }
        }
      }
    };
    var context = new Context();
    var postCompileCalled = false;
    var eventCount = 0;
    var machine = new FormStateMachine('/services/basic', '/services/basic',
                          () => {},  context, 'App::models::changed', false);
    var eventBus = $({});
    eventBus.on('App::models::changed', event => {
      eventCount++;
      var state = machine.getState();
      if(eventCount === 1){
        state.loading.should.be.equal(true);
      } if(eventCount === 2){
        state.loading.should.be.equal(false);
        if(postCompileCalled) done();
      }
    });

    machine.init(null, 'basic_form', eventBus, () => {
      postCompileCalled = true;
    }, 'new')

  });
});
