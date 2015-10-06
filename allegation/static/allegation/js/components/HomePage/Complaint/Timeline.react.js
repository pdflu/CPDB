var React = require('react');

var SIMPLE_DATE_FORMAT = 'MMM DD, YYYY';
var DETAIL_DATE_FORMAT = 'MMM DD, YYYY HH:mm';


var Timeline = React.createClass({
  getInitialState: function () {
    return {};
  },

  getOptions: function () {
    return {
      moveable: false,
      zoomable: false,
      height: 168,
      margin: 15,
      showMinorLabels: false,
      format: {
        majorLabels: {
          millisecond: 'MMMM YYYY',
          second: 'MMMM YYYY',
          minute: 'MMMM YYYY',
          hour: 'MMMM YYYY',
          weekday: 'MMMM YYYY',
          day: 'MMMM YYYY',
          month: 'YYYY',
          year: ''
        }
      }
    };
  },

  hasNoHourAndMinutes: function (date) {
    return date.get('hour') == 0 && date.get('minute') == 0
  },

  normalizeIncidentDate: function (incidentDate) {
    // We don't care about incident that happens before 1970
    if(incidentDate && moment(incidentDate).year() <= 1970) {
      return false;
    }
    return incidentDate;
  },

  normalizeStartDate: function (incidentDate, startDate) {
  // Set startDate hour to 23:59 if incidentDate and startDate is the same
    if (incidentDate.format(SIMPLE_DATE_FORMAT) == startDate.format(SIMPLE_DATE_FORMAT)) {
      return startDate.add(23, 'hours').add('59', 'minutes');
    }
    return startDate;
  },

  displayDateFormat: function (date, useSimpleFormat) {
    var displayFormat = (useSimpleFormat || this.hasNoHourAndMinutes(date)) ? SIMPLE_DATE_FORMAT : DETAIL_DATE_FORMAT;
    return date.format(displayFormat);
  },

  createTimelineItem: function (title, date, klass) {
    var useSimpleFormat = klass ? true : false;
    var displayDate = this.displayDateFormat(date, useSimpleFormat);
    klass = klass || '';

    title = '<div class="timeline-title">' + title + '</div>';
    var display = '<div class="timeline-date' + klass + '">' + displayDate + '</div>';
    return title + display;
  },

  componentDidMount: function () {
    var allegation = this.props.complaint.allegation;
    var container = $(this.getDOMNode()).find(".timeline")[0];
    var firstDate, lastDate, incidentDate;
    var items = [];

    allegation.incident_date = this.normalizeIncidentDate(allegation.incident_date);

    if (allegation.incident_date) {
      incidentDate = moment(allegation.incident_date);
      firstDate = incidentDate;
      lastDate = incidentDate;

      items.push({
        id: 1,
        content: this.createTimelineItem('Incident Date', incidentDate),
        start: incidentDate
      });
    }

    if (allegation.start_date) {
      var startDate = moment(allegation.start_date);

      if (firstDate) {
        lastDate = startDate;
        startDate = this.normalizeStartDate(incidentDate, startDate);
      }

      items.push({
        id: 2,
        content: this.createTimelineItem('Investigation Start', startDate, 'start'),
        start: startDate
      });
    }

    if (allegation.end_date) {
      var endDate = moment(allegation.end_date);
      firstDate = firstDate || endDate;
      lastDate = endDate;

      items.push({
        id: 3,
        content: this.createTimelineItem('Investigation End', endDate, 'end'),
        start: endDate,
        className: 'end'
      });
    }

    items = items || new vis.DataSet(items);

    // Configuration for the Timeline
    var options = this.getOptions();
    if(firstDate && lastDate) {
      var duration = lastDate.year() * 12 + lastDate.month() - firstDate.year() * 12 - firstDate.month();
      var subtract = 1;
      var add = 1;
      if (duration > 3){
        subtract = duration / 8;
        add = duration / 6;
      }
      options.start = moment(firstDate).subtract(subtract, 'months');
      options.end = moment(lastDate).add(add, 'months');
    }

    new vis.Timeline(container, items, options)
  },

  render: function () {
    var className = "col-md-6 " + (this.props.className || '');
    return (
      <div className={className}>
        <div className="section-title">Investigation timeline</div>
        <div className="timeline" />
      </div>
    );
  }
});

module.exports = Timeline;