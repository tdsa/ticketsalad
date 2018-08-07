<<<<<<< HEAD

import { Config, Runner } from 'angular-ecmascript/module-helpers';

import eventsTemplateUrl from '../templates/events.html';
import newEventTemplateUrl from '../templates/newEvent.html';
import editEventTemplateUrl from '../templates/editEvent.html';
import tabsTemplateUrl from '../templates/tabs.html';

export default class RoutesConfig extends Config {
  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl
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
      .state('tab.newEvent', {
        url: '/newEvent',
        views: {
          'tab-events':{
            templateUrl: newEventTemplateUrl,
            controller: 'NewEventCtrl as newEvent'
          }
        }
      })
      .state('tab.editEvent', {
        url: '/editEvent',
        views: {
          'tab-events':{
            templateUrl: editEventTemplateUrl,
            controller: 'EditEventCtrl as editEvent'
          }
        }
      });

    this.$urlRouterProvider.otherwise('tab/events');
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
=======
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
    user = null;
    id = null;
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
>>>>>>> feature/iOS_Platform
