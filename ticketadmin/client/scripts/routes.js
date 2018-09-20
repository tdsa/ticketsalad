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
import loginTemplateUrl from '../templates/login.html';

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
      .state('login', {
        url: '/login',
        templateUrl: loginTemplateUrl,
        controller: 'LoginCtrl as login'
      })
      .state('events', {
        url: '/events',
        templateUrl: eventsTemplateUrl,
        controller: 'EventsCtrl as events',
      })

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
