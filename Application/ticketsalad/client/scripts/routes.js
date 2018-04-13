import { _ } from 'meteor/underscore';
import { Config, Runner } from 'angular-ecmascript/module-helpers';
 
import eventsTemplateUrl from '../templates/events.html';
import profileTemplateUrl from '../templates/profile.html';
import editProfileTemplateUrl from '../templates/editProfile.html';
import loginTemplateUrl from '../templates/login.html';
import signupTemplateUrl from '../templates/signup.html';
import tabsTemplateUrl from '../templates/tabs.html';
 
class RoutesConfig extends Config {

  constructor() 
  {
    super(...arguments);

    
  }

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
            controller: 'EventsCtrl as events',
            resolve: {
              user: this.isAuthorized
            }
          }
        }
      })
      .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: profileTemplateUrl,
            controller: 'ProfileCtrl as profile',
            resolve: {
              user: this.isAuthorized
            }
          }
        }
        
      })

      .state('editProfile', {
        url: '/editProfile',
        templateUrl: editProfileTemplateUrl,
        controller: 'EditProfileCtrl as editProfile',
        resolve: {
          user: this.isAuthorized
        }
      })

      .state('tab.login', {
        url: '/login',
        views: {
          'tab-login': {
            templateUrl: loginTemplateUrl,
            controller: 'LoginCtrl as login'
          }
        }
        
      })
      .state('tab.signup', {
        url: '/signup',
        views: {
          'tab-signup': {
            templateUrl: signupTemplateUrl,
            controller: 'SignupCtrl as signup'
          }
        }
        
      });
 
    this.$urlRouterProvider.otherwise('tab/events');
  }

  isAuthorized() {
    if(!Meteor.user())
    {
      this.$state.go('tab.login');
    }
    else
    {
      return;
    }

    return;
  }
}
 
RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
 
class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
    });
  }
}
 
RoutesRunner.$inject = ['$rootScope', '$state'];
 
export default [RoutesConfig, RoutesRunner];
