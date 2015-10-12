var React = require('react');
var _ = require('lodash');

var Base = require('components/Base.react')
var StoryStore =require('stores/OfficerPage/StoryStore');
var DocumentCloudAPI = require('utils/DocumentCloudAPI');


var Story = React.createClass(_.assign(Base(StoryStore), {

  componentDidMount: function() {
    StoryStore.addChangeListener(this._onChange);

    if (this.props.story.url){
      DocumentCloudAPI.getThumbnail(this.props.story);
    }
  },

  renderDocumentLink: function () {
    var thumbUrl = this.props.story.thumbUrl;
    if (thumbUrl) {
      return (
        <a className="document-url" href={this.props.story.url}>
          <img className="document-thumbnail" src={thumbUrl} alt="thumbnail" />
        </a>
      );
    }
  },

  render: function () {
    var story = this.props.story;
    var description = story.short_description;
    var readmore = '';
    if (description.length >= 300) {
      description = description.substr(0, 300) + '...';
      readmore = (
        <a href="{story.absolute_url}">Read more</a>
      );
    }
    return (
      <div className="col-md-6 story">
        <h5 className="title">
          <a href="{story.absolute_url}">{story.title}</a>
        </h5>
        <div className="date">{story.created_date}</div>
        <div className="short-description" dangerouslySetInnerHTML={{__html: description + ' ' + readmore}}></div>
        { this.renderDocumentLink() }
      </div>
    );
  }

}));

module.exports = Story;
