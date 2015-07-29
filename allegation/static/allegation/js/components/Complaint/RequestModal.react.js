var React = require('react');
var RequestDocumentDispatcher = require('../../dispatcher/RequestDocumentDispatcher');
var RequestDocumentConstants = require('../../constants/RequestDocumentConstants');
var RequestDocumentActions = require('../../actions/RequestDocumentActions');


var RequestModal = (function () {
  var allegation = null;

  var mountedInstant = null;

  var component = React.createClass({
    getInitialState: function () {
      return {};
    },
    show: function () {
      $(this.getDOMNode()).modal("show");
    },
    hide: function () {
      $(this.getDOMNode()).modal("hide");
    },
    componentDidMount: function () {
      mountedInstant = this;
    },
    render: function () {
      return (
        <div className="modal fade" id="request_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h3>We'll notify you when the document is made available.</h3>
                <input type="email" name="email" className="form-control"
                       placeholder="Please enter email address" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.onClick}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      );
    },
    email: function () {
      return $(this.getDOMNode()).find("input[name='email']").val();
    },
    onClick: function () {
      $.ajax({
        url: '/document/request/',
        type: 'POST',
        dataType: 'JSON',
        data: {
          crid: allegation.crid,
          email: this.email()
        },
        success: function () {
          RequestDocumentActions.setRequested(allegation.crid);
        },
        error: function(xhr) {
          for (var key in xhr.responseJSON) {
            var errors = xhr.responseJSON[key];
            for (var i = 0; i < errors.length; i++) {
              toastr.error(errors[i]);
            }
          }
        }
      });
    }
  });

  component.show = function (complaint) {
    allegation = complaint.allegation;
    mountedInstant.show();
  };

  component.hide = function () {
    mountedInstant.hide();
  };

  return component;
})();

RequestDocumentDispatcher.register(function (action) {
  switch (action.actionType) {
    case RequestDocumentConstants.REQUEST_DOCUMENT:
      RequestModal.show(action.value);
      break;
    case RequestDocumentConstants.DOCUMENT_REQUESTED:
      toastr.success("We'll notify you when the document is made available.");
      RequestModal.hide();
      break;
    default:
      break;
  }
});

module.exports = RequestModal;
