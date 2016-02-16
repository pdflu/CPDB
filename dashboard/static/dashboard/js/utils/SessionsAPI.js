global.jQuery = require('jquery');

var AppConstants = require('../constants/AppConstants');
var SessionsActions = require('actions/SessionSection/SessionsActions');
var SessionSearchStore = require('stores/SessionSection/SessionSearchStore');

var ajax = null;
var limit = 0;
var count = 20;

var SessionsAPI = {
  get: function (query) {
    if (ajax) {
      ajax.abort();
    }

    limit = 0;
    var params = {
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSIONS_API_ENDPOINT, params, function (data) {
      SessionsActions.receivedData(data);
    });
  },

  getMore: function () {
    if (ajax) {
      ajax.abort();
    }

    limit += count;

    var params = {
      limit: count,
      offset: limit,
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSIONS_API_ENDPOINT, params, function (data) {
      SessionsActions.receivedMore(data.results);
    });
  }
};

module.exports = SessionsAPI;
