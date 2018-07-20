// Libs
import 'angular-animate';
import 'angular-meteor';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import { Meteor } from 'meteor/meteor';

// Modules
import EventsCtrl from '../controllers/events.controller';
import NewEventCtrl from '../controllers/newEvent.controller';
import EditEventCtrl from '../controllers/editEvent.controller';
import CalendarFilter from '../filters/calendar.filter';
import RoutesConfig from '../routes';

const App = 'TicketSalad Administration';

// App
Angular.module(App, [
  'angular-meteor',
  'ionic'
]);

new Loader(App)
  .load(EventsCtrl)
  .load(NewEventCtrl)
  .load(EditEventCtrl)
  .load(CalendarFilter)
  .load(RoutesConfig);

// Startup
if (Meteor.isCordova) {
  Angular.element(document).on('deviceready', onReady);
}
else {
  Angular.element(document).ready(onReady);
}

function onReady() {
  Angular.bootstrap(document, [App]);
}
