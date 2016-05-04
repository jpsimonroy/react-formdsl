"use strict";
require('./spec_helper');
var should = require('should');
var _ = require('underscore');
var FormStateMachine = require('./../lib/index').FormStateMachine;
var $ = require('jquery');
describe('Transitions', () => {
  it('should Transit turn on state elements based on transition rules', done => {
    var Context = class {
      constructor() {
        this.state = {
          digest: {
            actionable: null
          }
        }
      }
    };
    var context = new Context();
    var eventCount = 0;
    var machine = new FormStateMachine('/services/ticket_system', '/services/ticket_system',
      () => {}, context, 'App::models::changed', false);
    var eventBus = $({});
    eventBus.on('App::models::changed', event => {
      eventCount++;
      var state = machine.getState();
      if (eventCount === 1) {
        state.loading.should.be.equal(true);
      } else if (eventCount === 2) {
        state.loading.should.be.equal(false);
        state.formElements.length.should.be.equal(3)
        _.map(state.formElements, f => f.object.id).should.be.deepEqual(["ticket_summary", "ticket_description", "status"]);
        machine.autoSave('status', '2', () => eventBus.trigger('App::models::changed'), null);
      } else if (eventCount === 3) {
        state.formElements.length.should.be.equal(4);
        _.map(state.formElements, f => f.object.id).should.be.deepEqual(["ticket_summary", "ticket_description", "status", "cancelled_by"]);
        var statusElement = _.find(state.formElements, f => f.object.id === 'cancelled_by');
        should.exist(statusElement);
        machine.autoSave('cancelled_by', "1", () => eventBus.trigger('App::models::changed'), null);
      } else if(eventCount === 4){
        state.formElements.length.should.be.equal(4);
        _.map(state.formElements, f => f.object.id).should.be.deepEqual(["ticket_summary", "ticket_description", "status", "cancelled_by"]);
        machine.autoSave('cancelled_by', "2", () => eventBus.trigger('App::models::changed'), null);
      } else if(eventCount === 5){
        state.formElements.length.should.be.equal(5);
        _.map(state.formElements, f => f.object.id).should.be.deepEqual(["ticket_summary", "ticket_description", "status", "cancelled_by", "cancelled_comments"]);
        machine.autoSave('status', "3", () => eventBus.trigger('App::models::changed'), null);
      } else if(eventCount === 6){
        state.formElements.length.should.be.equal(4);
        _.map(state.formElements, f => f.object.id).should.be.deepEqual(["ticket_summary", "ticket_description", "status", "completion_remarks"]);
        done();
      }
    });

    machine.init(null, 'ticket_system', eventBus, () => {}, 'new')
  });
});
