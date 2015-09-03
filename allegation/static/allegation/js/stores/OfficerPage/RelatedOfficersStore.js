var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var MapConstants = require('../../constants/MapConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


//TODO: How to deal with duplication in OfficerPage components and HomePage components?
var _state = {
  'activeOfficers': []
}


var RelatedOfficersStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return _state;
  },

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case MapConstants.SET_ACTIVE_OFFICER:
    var index = _state.activeOfficers.indexOf(action.officer.id);
    if (index == -1) {
      _state['activeOfficers'].push(action.officer.id);

    }
    else {
      _state['activeOfficers'].splice(index, 1);
    }
    RelatedOfficersStore.emitChange();
    break;
    
  default:
      break;
  }
  

});


module.exports = RelatedOfficersStore;
