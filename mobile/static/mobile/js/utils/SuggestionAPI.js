var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var MainPageServerActions = require('actions/MainPage/MainPageServerActions');


var SuggestionAPI = {
  // TODO: only trigger the api after threshold, could put it to be defaul 300ms
  // TODO: cancel the previous api if it's not triggered yet
  get: function (query) {
    request.get(AppConstants.SUGGESTION_API_ENDPOINT)
      .query({query: query})
      .end(function (err, res) {
        if (res.ok) {
          MainPageServerActions.received(res.body, query)
        } else {
          MainPageServerActions.failedToReceive(query)
        }
      });
  }
};

module.exports = SuggestionAPI;
