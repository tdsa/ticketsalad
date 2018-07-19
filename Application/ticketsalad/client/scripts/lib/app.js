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
import ProfileCtrl from '../controllers/profile.controller';
import EditProfileCtrl from '../controllers/editProfile.controller';
import BuyCreditsCtrl from '../controllers/buyCredits.controller';
import CompleteProfileCtrl from '../controllers/completeProfile.controller';
import NewCardCtrl from '../controllers/newCard.controller';
import LoginCtrl from '../controllers/login.controller';
import SignupCtrl from '../controllers/signup.controller';
import ForgotPasswordCtrl from '../controllers/forgotPassword.controller';
import TermsConditionsCtrl from '../controllers/termsConditions.controller';
import Routes from '../routes';

const App = 'TicketSalad';
 
// App
Angular.module(App, [
  'angular-meteor',
  'angular-meteor.auth',
  'ionic'
]);

//Loads controllers to be used
new Loader(App)
.load(EventsCtrl)
.load(ProfileCtrl)
.load(CompleteProfileCtrl)
.load(EditProfileCtrl)
.load(NewCardCtrl)
.load(ForgotPasswordCtrl)
.load(LoginCtrl)
.load(SignupCtrl)
.load(BuyCreditsCtrl)
.load(TermsConditionsCtrl)
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