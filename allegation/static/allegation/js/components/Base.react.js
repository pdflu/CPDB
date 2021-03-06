/*eslint react/no-is-mounted:0 */
var _ = require('lodash');

var Base = function (Store) {
  return {
    init: function (params) {
      _.extend(Store.getState(), params);
      return this.getState();
    },

    getInitialState: function () {
      return Store.getState();
    },

    componentDidMount: function () {
      Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
      Store.removeChangeListener(this._onChange);
    },

    _onChange: function () {
      if (this.isMounted()) {
        this.setState(Store.getState());
      }
    }
  };
};

module.exports = Base;
