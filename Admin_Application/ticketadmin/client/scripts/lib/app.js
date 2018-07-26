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
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import { Meteor } from 'meteor/meteor';
 
// Modules
import EventsCtrl from '../controllers/events.controller';
import LoginCtrl from '../controllers/login.controller';
import Section1Ctrl from '../controllers/section1.controller';
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
.load(Section1Ctrl)
.load(LoginCtrl)
.load(Routes);

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