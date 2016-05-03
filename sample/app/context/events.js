var App = {
  events: {
    initComplete: 'app::initComplete',
    goBack: 'app::goBack',
    ui: {
      render: 'app::state_changed',
      alert: 'app::alert(msg|title)',
      confirm: 'app::confirm(msg|title)',
      showSidebar: 'app::ui::showSidebar(none)',
      route: 'app::ui::route(route)'
    },
    basic: {
      initialState: 'app::basic::initialState(none)',
      initNew: 'app::basic::initTakeAction(none)',
      autoSave: 'app::basic::autoSave::takeAction(element|value)',
      takeAction: 'app::basic::take_action(none)'
    }
    models: {
      changed: 'app::models_changed',
      reset: 'app::models::reset'
    },
    master: {
      init: 'app::master::init(none)',
      initialState: 'app::master::initialState(none)'
    }
  }
};

module.exports = App;
