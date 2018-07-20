
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
