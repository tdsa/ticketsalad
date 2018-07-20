var require = meteorInstall({"client":{"templates":{"editEvent.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/editEvent.html                                                             //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.watch(require("./template.editEvent.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////

},"template.editEvent.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/template.editEvent.js                                                      //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //

  var templateUrl = "client/templates/editEvent.html";
  angular.module('angular-templates')
    .run(['$templateCache', function($templateCache) {
      $templateCache.put(templateUrl, "<ion-view view-title=\"Editing {{editEvent.event.name}}\"> <ion-content> <div class=\"ui center aligned segment\"> <form class=\"ui form\" style=\"padding-top:5%\"> <div class=\"field\"> <label>Event Name</label> <input type=\"text\" name=\"name\" ng-model=\"editEvent.event.name\"> </div> <div class=\"field\"> <label>City</label> <input type=\"text\" name=\"city\" ng-model=\"editEvent.event.city\"> </div> <div class=\"field\"> <label>Country</label> <input type=\"text\" name=\"country\" ng-model=\"editEvent.event.country\"> </div> <div class=\"field\"> <label>Starting date</label> <input type=\"text\" name=\"from\" ng-model=\"editEvent.event.from\"> </div> <div class=\"field\"> <label>Webpage</label> <input type=\"text\" name=\"webpage\" ng-model=\"editEvent.event.webpage\"> </div> <div class=\"field\"> <label>Cost per claim</label> <input type=\"text\" name=\"credits\" ng-model=\"editEvent.event.credits\"> </div> <div class=\"field\"> <label>Tickets</label> <input type=\"text\" name=\"tickets\" ng-model=\"editEvent.event.tickets\"> </div> <div class=\"field\"> <label>About</label> <input type=\"textarea\" name=\"about\" ng-model=\"editEvent.event.about\"> </div> <div class=\"ui buttons\"> <button class=\"ui button\" ng-click=\"editEvent.delete()\">Delete</button> <div class=\"or\"></div> <button class=\"ui positive button\" ng-click=\"editEvent.done()\">Save</button> </div> </form> </div> </ion-content> </ion-view>");
    }]);
  if (typeof exports !== 'undefined') {
    exports.__esModule = true;
    exports.default = templateUrl;
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////

},"events.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/events.html                                                                //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.watch(require("./template.events.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////

},"template.events.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/template.events.js                                                         //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //

  var templateUrl = "client/templates/events.html";
  angular.module('angular-templates')
    .run(['$templateCache', function($templateCache) {
      $templateCache.put(templateUrl, "<ion-view view-title=\"Manage Events\"> <ion-content> <ion-list> <ion-item ng-repeat=\"event in events.data\" type=\"item-text-wrap\" href=\"#!/tab/editEvent\" ng-click=\"events.loadEvent(event)\"> <h2>{{ event.name }}</h2> <h3>{{event.city}}, {{event.country}}</h3> <p>Current Claims: {{event.claims}}</p> </ion-item> <ion-item href=\"#!/tab/newEvent\"> Add new event </ion-item> </ion-list> </ion-content> </ion-view>");
    }]);
  if (typeof exports !== 'undefined') {
    exports.__esModule = true;
    exports.default = templateUrl;
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////

},"newEvent.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/newEvent.html                                                              //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.watch(require("./template.newEvent.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////

},"template.newEvent.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/template.newEvent.js                                                       //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //

  var templateUrl = "client/templates/newEvent.html";
  angular.module('angular-templates')
    .run(['$templateCache', function($templateCache) {
      $templateCache.put(templateUrl, "<ion-view view-title=\"Create New Event\"> <ion-content> <div class=\"ui center aligned segment\"> <form class=\"ui form\" style=\"padding-top:5%\"> <div class=\"field\"> <label>Event Name</label> <input type=\"text\" name=\"name\" ng-model=\"newEvent.name\"> </div> <div class=\"field\"> <label>City</label> <input type=\"text\" name=\"city\" ng-model=\"newEvent.city\"> </div> <div class=\"field\"> <label>Country</label> <input type=\"text\" name=\"country\" ng-model=\"newEvent.country\"> </div> <div class=\"field\"> <label>Starting date</label> <input type=\"text\" name=\"from\" ng-model=\"newEvent.from\"> </div> <div class=\"field\"> <label>Webpage</label> <input type=\"text\" name=\"webpage\" ng-model=\"newEvent.webpage\"> </div> <div class=\"field\"> <label>Cost per claim</label> <input type=\"number\" name=\"credits\" ng-model=\"newEvent.credits\"> </div> <div class=\"field\"> <label>Tickets</label> <input type=\"number\" name=\"tickets\" ng-model=\"newEvent.tickets\"> </div> <div class=\"field\"> <label>About</label> <input type=\"textarea\" name=\"about\" ng-model=\"newEvent.about\"> </div> <button class=\"ui button\" ng-click=\"newEvent.done()\">Save</button> </form> </div> </ion-content> </ion-view>");
    }]);
  if (typeof exports !== 'undefined') {
    exports.__esModule = true;
    exports.default = templateUrl;
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////

},"tabs.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/tabs.html                                                                  //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.watch(require("./template.tabs.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////

},"template.tabs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/templates/template.tabs.js                                                           //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //

  var templateUrl = "client/templates/tabs.html";
  angular.module('angular-templates')
    .run(['$templateCache', function($templateCache) {
      $templateCache.put(templateUrl, "<ion-tabs class=\"tabs-stable tabs-icon-top tabs-color-positive\" ng-cloak> <ion-tab title=\"Events\" icon-on=\"ion-ios-chatbubble\" icon-off=\"ion-ios-chatbubble-outline\" href=\"#/tab/events\"> <ion-nav-view name=\"tab-events\"></ion-nav-view> </ion-tab> <ion-tab title=\"Settings\" icon-on=\"ion-ios-cog\" icon-off=\"ion-ios-cog-outline\" href=\"#/tab/settings\"> <ion-nav-view name=\"tab-settings\"></ion-nav-view> </ion-tab> </ion-tabs>");
    }]);
  if (typeof exports !== 'undefined') {
    exports.__esModule = true;
    exports.default = templateUrl;
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"scripts":{"lib":{"app.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/lib/app.js                                                                   //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var module1 = module;
module1.watch(require("angular-animate"));
module1.watch(require("angular-meteor"));
module1.watch(require("angular-sanitize"));
module1.watch(require("angular-ui-router"));
module1.watch(require("ionic-scripts"));
var Angular;
module1.watch(require("angular"), {
  "default": function (v) {
    Angular = v;
  }
}, 0);
var Loader;
module1.watch(require("angular-ecmascript/module-loader"), {
  "default": function (v) {
    Loader = v;
  }
}, 1);
var Meteor;
module1.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
var EventsCtrl;
module1.watch(require("../controllers/events.controller"), {
  "default": function (v) {
    EventsCtrl = v;
  }
}, 3);
var NewEventCtrl;
module1.watch(require("../controllers/newEvent.controller"), {
  "default": function (v) {
    NewEventCtrl = v;
  }
}, 4);
var EditEventCtrl;
module1.watch(require("../controllers/editEvent.controller"), {
  "default": function (v) {
    EditEventCtrl = v;
  }
}, 5);
var CalendarFilter;
module1.watch(require("../filters/calendar.filter"), {
  "default": function (v) {
    CalendarFilter = v;
  }
}, 6);
var RoutesConfig;
module1.watch(require("../routes"), {
  "default": function (v) {
    RoutesConfig = v;
  }
}, 7);
var App = 'TicketSalad Administration'; // App

Angular.module(App, ['angular-meteor', 'ionic']);
new Loader(App).load(EventsCtrl).load(NewEventCtrl).load(EditEventCtrl).load(CalendarFilter).load(RoutesConfig); // Startup

if (Meteor.isCordova) {
  Angular.element(document).on('deviceready', onReady);
} else {
  Angular.element(document).ready(onReady);
}

function onReady() {
  Angular.bootstrap(document, [App]);
}
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"controllers":{"editEvent.controller.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/controllers/editEvent.controller.js                                          //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var module1 = module;
module1.export({
  "default": function () {
    return EditEventCtrl;
  }
});
var Moment;
module1.watch(require("moment"), {
  "default": function (v) {
    Moment = v;
  }
}, 0);
var Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller: function (v) {
    Controller = v;
  }
}, 1);
var Events;
module1.watch(require("../../../lib/collections"), {
  Events: function (v) {
    Events = v;
  }
}, 2);

var EditEventCtrl =
/*#__PURE__*/
function (_Controller) {
  (0, _inheritsLoose2.default)(EditEventCtrl, _Controller);

  function EditEventCtrl() {
    var _this;

    _this = _Controller.apply(this, arguments) || this;

    _this.helpers({
      data: function () {
        return Events.find();
      },
      load: function () {
        this.event = Session.get("editEvent");
        console.log(this.event);
      }
    });

    return _this;
  }

  var _proto = EditEventCtrl.prototype;

  _proto.done = function () {
    function done() {
      Events.update(this.event._id, {
        $set: {
          name: this.event.name,
          city: this.event.city,
          country: this.event.country,
          from: this.event.from,
          to: this.event.to,
          webpage: this.event.webpage,
          credits: this.event.credits,
          about: this.event.about
        }
      });
      this.$state.go("tab.events");
    }

    return done;
  }();

  _proto.delete = function () {
    function _delete() {
      Events.remove(this.event._id);
      this.$state.go("tab.events");
    }

    return _delete;
  }();

  return EditEventCtrl;
}(Controller);

EditEventCtrl.$name = 'EditEventCtrl';
EditEventCtrl.$inject = ['$state', '$ionicPopup', '$log'];
/////////////////////////////////////////////////////////////////////////////////////////////////

},"events.controller.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/controllers/events.controller.js                                             //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var module1 = module;
module1.export({
  "default": function () {
    return EventsCtrl;
  }
});
var Moment;
module1.watch(require("moment"), {
  "default": function (v) {
    Moment = v;
  }
}, 0);
var Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller: function (v) {
    Controller = v;
  }
}, 1);
var Events;
module1.watch(require("../../../lib/collections"), {
  Events: function (v) {
    Events = v;
  }
}, 2);

var EventsCtrl =
/*#__PURE__*/
function (_Controller) {
  (0, _inheritsLoose2.default)(EventsCtrl, _Controller);

  function EventsCtrl() {
    var _this;

    _this = _Controller.apply(this, arguments) || this;

    _this.helpers({
      data: function () {
        return Events.find();
      }
    });

    return _this;
  }

  var _proto = EventsCtrl.prototype;

  _proto.createNew = function () {
    function createNew() {
      console.log("new");
      this.$state.go('tab.newEvent');
      console.log("gone");
    }

    return createNew;
  }();

  _proto.loadEvent = function () {
    function loadEvent(event) {
      console.log("Loading event");
      Session.set("editEvent", event);
    }

    return loadEvent;
  }();

  return EventsCtrl;
}(Controller);

EventsCtrl.$name = 'EventsCtrl';
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];
/////////////////////////////////////////////////////////////////////////////////////////////////

},"newEvent.controller.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/controllers/newEvent.controller.js                                           //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var module1 = module;
module1.export({
  "default": function () {
    return NewEventCtrl;
  }
});
var Moment;
module1.watch(require("moment"), {
  "default": function (v) {
    Moment = v;
  }
}, 0);
var Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller: function (v) {
    Controller = v;
  }
}, 1);
var Events;
module1.watch(require("../../../lib/collections"), {
  Events: function (v) {
    Events = v;
  }
}, 2);

var NewEventCtrl =
/*#__PURE__*/
function (_Controller) {
  (0, _inheritsLoose2.default)(NewEventCtrl, _Controller);

  function NewEventCtrl() {
    var _this;

    _this = _Controller.apply(this, arguments) || this;

    _this.helpers({
      data: function () {
        return Events.find();
      }
    });

    return _this;
  }

  var _proto = NewEventCtrl.prototype;

  _proto.generateCode = function () {
    function generateCode() {
      var code = "";

      for (var index = 0; index < 5; index++) {
        var digit = Math.floor(Math.random() * 10);
        code += digit + "";
      } //Console.log(code);


      return code;
    }

    return generateCode;
  }();

  _proto.done = function () {
    function done() {
      var event = {
        name: this.name,
        city: this.city,
        country: this.country,
        picture: 'img/TL.jpg',
        from: this.from,
        to: this.to,
        webpage: this.webpage,
        credits: this.credits,
        about: this.about,
        claims: 0,
        code: this.generateCode(),
        claimed: 0,
        winner: null
      };
      Events.insert(event);
      this.$state.go("tab.events");
    }

    return done;
  }();

  return NewEventCtrl;
}(Controller);

NewEventCtrl.$name = 'NewEventCtrl';
NewEventCtrl.$inject = ['$state', '$ionicPopup', '$log'];
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"filters":{"calendar.filter.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/filters/calendar.filter.js                                                   //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var module1 = module;
module1.export({
  "default": function () {
    return CalendarFilter;
  }
});
var Moment;
module1.watch(require("moment"), {
  "default": function (v) {
    Moment = v;
  }
}, 0);
var Filter;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Filter: function (v) {
    Filter = v;
  }
}, 1);

var CalendarFilter =
/*#__PURE__*/
function (_Filter) {
  (0, _inheritsLoose2.default)(CalendarFilter, _Filter);

  function CalendarFilter() {
    return _Filter.apply(this, arguments) || this;
  }

  var _proto = CalendarFilter.prototype;

  _proto.filter = function () {
    function filter(time) {
      if (!time) return;
      return Moment(time).calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: 'LT',
        lastWeek: 'dddd',
        sameElse: 'DD/MM/YY'
      });
    }

    return filter;
  }();

  return CalendarFilter;
}(Filter);

CalendarFilter.$name = 'calendar';
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// client/scripts/routes.js                                                                    //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var module1 = module;
module1.export({
  "default": function () {
    return RoutesConfig;
  }
});
var Config, Runner;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Config: function (v) {
    Config = v;
  },
  Runner: function (v) {
    Runner = v;
  }
}, 0);
var eventsTemplateUrl;
module1.watch(require("../templates/events.html"), {
  "default": function (v) {
    eventsTemplateUrl = v;
  }
}, 1);
var newEventTemplateUrl;
module1.watch(require("../templates/newEvent.html"), {
  "default": function (v) {
    newEventTemplateUrl = v;
  }
}, 2);
var editEventTemplateUrl;
module1.watch(require("../templates/editEvent.html"), {
  "default": function (v) {
    editEventTemplateUrl = v;
  }
}, 3);
var tabsTemplateUrl;
module1.watch(require("../templates/tabs.html"), {
  "default": function (v) {
    tabsTemplateUrl = v;
  }
}, 4);

var RoutesConfig =
/*#__PURE__*/
function (_Config) {
  (0, _inheritsLoose2.default)(RoutesConfig, _Config);

  function RoutesConfig() {
    return _Config.apply(this, arguments) || this;
  }

  var _proto = RoutesConfig.prototype;

  _proto.configure = function () {
    function configure() {
      this.$stateProvider.state('tab', {
        url: '/tab',
        "abstract": true,
        templateUrl: tabsTemplateUrl
      }).state('tab.events', {
        url: '/events',
        views: {
          'tab-events': {
            templateUrl: eventsTemplateUrl,
            controller: 'EventsCtrl as events'
          }
        }
      }).state('tab.newEvent', {
        url: '/newEvent',
        views: {
          'tab-events': {
            templateUrl: newEventTemplateUrl,
            controller: 'NewEventCtrl as newEvent'
          }
        }
      }).state('tab.editEvent', {
        url: '/editEvent',
        views: {
          'tab-events': {
            templateUrl: editEventTemplateUrl,
            controller: 'EditEventCtrl as editEvent'
          }
        }
      });
      this.$urlRouterProvider.otherwise('tab/events');
    }

    return configure;
  }();

  return RoutesConfig;
}(Config);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
/////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lib":{"collections.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// lib/collections.js                                                                          //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.export({
  Events: function () {
    return Events;
  }
});
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 0);
var Events = new Mongo.Collection('events');
/////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css",
    ".scss"
  ]
});
require("/client/templates/template.editEvent.js");
require("/client/templates/template.events.js");
require("/client/templates/template.newEvent.js");
require("/client/templates/template.tabs.js");
require("/client/scripts/lib/app.js");
require("/lib/collections.js");
require("/client/scripts/controllers/editEvent.controller.js");
require("/client/scripts/controllers/events.controller.js");
require("/client/scripts/controllers/newEvent.controller.js");
require("/client/scripts/filters/calendar.filter.js");
require("/client/scripts/routes.js");