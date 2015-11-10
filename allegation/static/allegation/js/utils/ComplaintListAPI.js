require('utils/jQuery');

var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');
var AppConstants = require('../constants/AppConstants');
var ComplaintListServerActions = require('../actions/ComplaintList/ComplaintListServerActions');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');

var ajax = null;

var ComplaintListAPI = {
  preloadDataForOtherTab: function () {
    for (filter in AppConstants.FILTERS) {
      var queryString = AllegationFetcherQueryBuilder.buildQuery(filter);
      ajax = jQuery.getJSON('/api/allegations/?' + queryString, function (data) {
      });
    }
  },

  getData: function (fromFilter) {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var that = this;
    ComplaintListServerActions.getData();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = jQuery.getJSON('/api/allegations/?' + queryString, function (data) {
        ComplaintListServerActions.receivedData(data, fromFilter);
        if (!fromFilter) {
          that.preloadDataForOtherTab();
        }
      });
    } else {
      ComplaintListServerActions.receivedData({'allegations': [], 'analytics': {}, noQuery: true}, fromFilter);
    }
  },

  getAllForOfficer: function(officer) {
    var endpoint = '/api/allegations/?officer=' + officer + '&length=-1';

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(endpoint, function (data) {
      ComplaintListServerActions.receivedOfficerComplaints(data);
    });
  },

  getMoreData: function (pageNumber) {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var pagedQuery = [queryString, 'page=' + pageNumber, 'length=25'].join('&');

    if (queryString) {
      jQuery.getJSON('/api/allegations/?' + pagedQuery, function (data) {
        ComplaintListServerActions.receivedMoreData(data);
      });
    }
  },
};

module.exports = ComplaintListAPI;
