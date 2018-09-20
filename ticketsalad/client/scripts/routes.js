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
import launchTemplateUrl from '../templates/launch.html';
import eventsTemplateUrl from '../templates/events.html';
import profileTemplateUrl from '../templates/profile.html';
import buyCreditsTemplateUrl from '../templates/buyCredits.html';
import completeProfileTemplateUrl from '../templates/completeProfile.html';
import activityTemplateUrl from '../templates/activity.html';
import editProfileTemplateUrl from '../templates/editProfile.html';
import loginTemplateUrl from '../templates/login.html';
import signupTemplateUrl from '../templates/signup.html';
import forgotPasswordTemplateUrl from '../templates/forgotPassword.html';
import termsConditionsTemplateUrl from '../templates/termsConditions.html';
import tabsTemplateUrl from '../templates/tabs.html';

class RoutesConfig extends Config {

  constructor()
  {
    super(...arguments);
    this.user = null;
    this.id = null;
  }

  configure() //Creates the templates as states
  {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl
      })
      .state('launch', {
        url: '/launch',
        templateUrl: launchTemplateUrl,
        controller: 'LaunchCtrl as launch'
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
      .state('events', {
        url: '/events',
        templateUrl: eventsTemplateUrl,
        controller: 'EventsCtrl as events'
      })
      .state('profile', {
        url: '/profile',
          templateUrl: profileTemplateUrl,
          controller: 'ProfileCtrl as profile'
      })
      .state('buyCredits', {
        url: '/buyCredits',
          templateUrl: buyCreditsTemplateUrl,
          controller: 'BuyCreditsCtrl as buyCredits'
      })
      .state('eventCredits', {
        url: '/eventCredits',
          templateUrl: buyCreditsTemplateUrl,
          controller: 'BuyCreditsCtrl as buyCredits'
      })
      .state('completeProfile', {
        url: '/completeProfile',
          templateUrl: completeProfileTemplateUrl,
          controller: 'CompleteProfileCtrl as completeProfile',
      })
      .state('editProfile', {
        url: '/editProfile',
          templateUrl: editProfileTemplateUrl,
          controller: 'EditProfileCtrl as editProfile'
      })
      .state('termsConditions', {
        url: '/termsConditions',
          templateUrl: termsConditionsTemplateUrl,
          controller: 'TermsConditionsCtrl as termsConditions'
      })
      .state('activity', {
        url: '/activity',
          templateUrl: activityTemplateUrl,
          controller: 'ActivityCtrl as activity'
      })

    this.$urlRouterProvider.otherwise('launch'); //Default state
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
