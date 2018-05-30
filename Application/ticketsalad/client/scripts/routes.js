/*
* File Name: routes.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: routes handles all javascript associated importing templates from the HTML counterparts, and configuring them as states
These states are used to provide the different views of the application
*/

//libs
import { _ } from 'meteor/underscore';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

//Templates
import eventsTemplateUrl from '../templates/events.html';
import profileTemplateUrl from '../templates/profile.html';
import buyCreditsTemplateUrl from '../templates/buyCredits.html';
import completeProfileTemplateUrl from '../templates/completeProfile.html';
import newCardTemplateUrl from '../templates/newCard.html';
import editProfileTemplateUrl from '../templates/editProfile.html';
import loginTemplateUrl from '../templates/login.html';
import signupTemplateUrl from '../templates/signup.html';
import forgotPasswordTemplateUrl from '../templates/forgotPassword.html';
import tabsTemplateUrl from '../templates/tabs.html';
 
class RoutesConfig extends Config {

  constructor() 
  {
    super(...arguments);
  }

  configure() //Creates the templates as states
  {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl
      })
      .state('forgotPassword', {
        url: '/forgotpassword',
        templateUrl: forgotPasswordTemplateUrl,
        controller: 'ForgotPasswordCtrl as forgotPassword' 
      })
      .state('login', {
        url: '/login',
        templateUrl: loginTemplateUrl,
        controller: 'LoginCtrl as login'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: signupTemplateUrl,
        controller: 'SignupCtrl as signup' 
      })
      .state('tab.events', {
        url: '/events',
        views: {
          'tab-events': {
            templateUrl: eventsTemplateUrl,
            controller: 'EventsCtrl as events'
          }
        }
      })
      .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: profileTemplateUrl,
            controller: 'ProfileCtrl as profile'
          }
        }
      })
      .state('tab.buyCredits', {
        url: '/buyCredits',
        views: {
          'tab-profile': {
            templateUrl: buyCreditsTemplateUrl,
            controller: 'BuyCreditsCtrl as buyCredits'
            }
          }
      })
      .state('tab.completeProfile', {
        url: '/completeProfile',
        views: {
          'tab-events': {
            templateUrl: completeProfileTemplateUrl,
            controller: 'CompleteProfileCtrl as completeProfile'
            }
          }
      })
      .state('tab.editProfile', {
        url: '/editProfile',
        views: {
          'tab-profile': {
            templateUrl: editProfileTemplateUrl,
            controller: 'EditProfileCtrl as editProfile'
            }
          }
      })
      .state('tab.newCard', {
        url: '/newCard',
        views: {
          'tab-profile': {
            templateUrl: newCardTemplateUrl,
            controller: 'NewCardCtrl as newCard'
            }
          }
      });
 
    this.$urlRouterProvider.otherwise('login'); //Default state
  }
}
 
RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider']; //Puts all the states in a router
 
class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
    });
  }
}
 
RoutesRunner.$inject = ['$rootScope', '$state'];
 
export default [RoutesConfig, RoutesRunner];
