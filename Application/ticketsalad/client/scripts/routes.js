import { _ } from 'meteor/underscore';
import { Config, Runner } from 'angular-ecmascript/module-helpers';
 
import eventsTemplateUrl from '../templates/events.html';
import profileTemplateUrl from '../templates/profile.html';
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

  configure() {
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

      .state('editProfile', {
        url: '/editProfile',
        templateUrl: editProfileTemplateUrl,
        controller: 'EditProfileCtrl as editProfile'
      });
 
    this.$urlRouterProvider.otherwise('login');
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
