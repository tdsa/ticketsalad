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
import ProfileCtrl from '../controllers/profile.controller';
import EditProfileCtrl from '../controllers/editProfile.controller';
import LoginCtrl from '../controllers/login.controller';
import SignupCtrl from '../controllers/signup.controller';
import Routes from '../routes';

const App = 'TicketSalad';
 
// App
Angular.module(App, [
  'angular-meteor',
  'angular-meteor.auth',
  'ionic'
]);

new Loader(App)
.load(EventsCtrl)
.load(ProfileCtrl)
.load(EditProfileCtrl)
.load(LoginCtrl)
.load(SignupCtrl)
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