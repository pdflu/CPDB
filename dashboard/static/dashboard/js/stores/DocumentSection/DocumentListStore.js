var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('../Base');

var _state = {
  documents: [],
  locked: false,
  sortBy: 'number_of_request',
  order: -1
};

var DocumentListStore = _.assign(Base(_state), {
  getSortOrder: function () {
    if (_state['sortBy']) {
      return (_state['order'] > 0 ? '' : '-') + _state['sortBy'];
    }
    return '';
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT_LIST:
      _state.documents = action.data;
      DocumentListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA:
      if (!_.isEmpty(action.data)) {
        _state.documents = _state.documents.concat(action.data);
        _state.locked = false;
        DocumentListStore.emitChange();
      }
      break;

    case AppConstants.LOCK_SCROLL_DOCUMENT_LIST:
      _state.locked = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_REQUEST_CANCEL:
      action.data['document_requested'] = false;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_PENDING:
      action.data['document_pending'] = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_REQUESTING:
      action.data['document_pending'] = false;
      action.data['document_requested'] = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_SORT_LIST:
      var currentSortBy = _state['sortBy'];
      var order = _state['order'];
      var sortBy = action.data;

      if (currentSortBy == sortBy) {
        order = -order;
      }

      DocumentListStore.updateState('sortBy', action.data);
      DocumentListStore.updateState('order', order);
      DocumentListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = DocumentListStore;
