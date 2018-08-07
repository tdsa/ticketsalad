<<<<<<< HEAD
// Libs
import 'angular-animate';
import 'angular-meteor';
=======
/*
* File Name: app.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: app handles all javascript associated with initiating the application, importing all controllers.
It performs all onReady functionalities and loads all the views in the tab stack.
*/

// Libs
import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
>>>>>>> feature/iOS_Platform
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import { Meteor } from 'meteor/meteor';
<<<<<<< HEAD

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
=======
 
// Modules
import EventsCtrl from '../controllers/events.controller';
import LoginCtrl from '../controllers/login.controller';
import Routes from '../routes';

const App = 'TicketAdmin';
 
// App
Angular.module(App, [
  'angular-meteor',
  'angular-meteor.auth',
  'ionic'
]);

//Loads controllers to be used
new Loader(App)
.load(EventsCtrl)
.load(LoginCtrl)
.load(Routes);
>>>>>>> feature/iOS_Platform

// Startup
if (Meteor.isCordova) {
  Angular.element(document).on('deviceready', onReady);
}
else {
  Angular.element(document).ready(onReady);
}
<<<<<<< HEAD

function onReady() {
  Angular.bootstrap(document, [App]);
}
=======
 
function onReady() {
  Angular.bootstrap(document, [App]);
}
>>>>>>> feature/iOS_Platform
