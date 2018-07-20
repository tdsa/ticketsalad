var require = meteorInstall({"client":{"templates":{"editEvent.html":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/editEvent.html                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.watch(require("./template.editEvent.js"), {
  "*": module.makeNsSetter(true)
});

///////////////////////////////////////////////////////////////////////

},"template.editEvent.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/template.editEvent.js                            //
//                                                                   //
///////////////////////////////////////////////////////////////////////
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
  
///////////////////////////////////////////////////////////////////////

},"events.html":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/events.html                                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.watch(require("./template.events.js"), {
  "*": module.makeNsSetter(true)
});

///////////////////////////////////////////////////////////////////////

},"template.events.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/template.events.js                               //
//                                                                   //
///////////////////////////////////////////////////////////////////////
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
  
///////////////////////////////////////////////////////////////////////

},"newEvent.html":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/newEvent.html                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.watch(require("./template.newEvent.js"), {
  "*": module.makeNsSetter(true)
});

///////////////////////////////////////////////////////////////////////

},"template.newEvent.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/template.newEvent.js                             //
//                                                                   //
///////////////////////////////////////////////////////////////////////
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
  
///////////////////////////////////////////////////////////////////////

},"tabs.html":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/tabs.html                                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.watch(require("./template.tabs.js"), {
  "*": module.makeNsSetter(true)
});

///////////////////////////////////////////////////////////////////////

},"template.tabs.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/templates/template.tabs.js                                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
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
  
///////////////////////////////////////////////////////////////////////

}},"scripts":{"lib":{"app.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/lib/app.js                                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.watch(require("angular-animate"));
module1.watch(require("angular-meteor"));
module1.watch(require("angular-sanitize"));
module1.watch(require("angular-ui-router"));
module1.watch(require("ionic-scripts"));
let Angular;
module1.watch(require("angular"), {
  default(v) {
    Angular = v;
  }

}, 0);
let Loader;
module1.watch(require("angular-ecmascript/module-loader"), {
  default(v) {
    Loader = v;
  }

}, 1);
let Meteor;
module1.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let EventsCtrl;
module1.watch(require("../controllers/events.controller"), {
  default(v) {
    EventsCtrl = v;
  }

}, 3);
let NewEventCtrl;
module1.watch(require("../controllers/newEvent.controller"), {
  default(v) {
    NewEventCtrl = v;
  }

}, 4);
let EditEventCtrl;
module1.watch(require("../controllers/editEvent.controller"), {
  default(v) {
    EditEventCtrl = v;
  }

}, 5);
let CalendarFilter;
module1.watch(require("../filters/calendar.filter"), {
  default(v) {
    CalendarFilter = v;
  }

}, 6);
let RoutesConfig;
module1.watch(require("../routes"), {
  default(v) {
    RoutesConfig = v;
  }

}, 7);
const App = 'TicketSalad Administration'; // App

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
///////////////////////////////////////////////////////////////////////

}},"controllers":{"editEvent.controller.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/controllers/editEvent.controller.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.export({
  default: () => EditEventCtrl
});
let Moment;
module1.watch(require("moment"), {
  default(v) {
    Moment = v;
  }

}, 0);
let Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller(v) {
    Controller = v;
  }

}, 1);
let Events;
module1.watch(require("../../../lib/collections"), {
  Events(v) {
    Events = v;
  }

}, 2);

class EditEventCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.helpers({
      data() {
        return Events.find();
      },

      load() {
        this.event = Session.get("editEvent");
        console.log(this.event);
      }

    });
  }

  done() {
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

  delete() {
    Events.remove(this.event._id);
    this.$state.go("tab.events");
  }

}

EditEventCtrl.$name = 'EditEventCtrl';
EditEventCtrl.$inject = ['$state', '$ionicPopup', '$log'];
///////////////////////////////////////////////////////////////////////

},"events.controller.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/controllers/events.controller.js                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.export({
  default: () => EventsCtrl
});
let Moment;
module1.watch(require("moment"), {
  default(v) {
    Moment = v;
  }

}, 0);
let Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller(v) {
    Controller = v;
  }

}, 1);
let Events;
module1.watch(require("../../../lib/collections"), {
  Events(v) {
    Events = v;
  }

}, 2);

class EventsCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.helpers({
      data() {
        return Events.find();
      }

    });
  }

  createNew() {
    console.log("new");
    this.$state.go('tab.newEvent');
    console.log("gone");
  }

  loadEvent(event) {
    console.log("Loading event");
    Session.set("editEvent", event);
  }

}

EventsCtrl.$name = 'EventsCtrl';
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];
///////////////////////////////////////////////////////////////////////

},"newEvent.controller.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/controllers/newEvent.controller.js                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.export({
  default: () => NewEventCtrl
});
let Moment;
module1.watch(require("moment"), {
  default(v) {
    Moment = v;
  }

}, 0);
let Controller;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Controller(v) {
    Controller = v;
  }

}, 1);
let Events;
module1.watch(require("../../../lib/collections"), {
  Events(v) {
    Events = v;
  }

}, 2);

class NewEventCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.helpers({
      data() {
        return Events.find();
      }

    });
  }

  generateCode() {
    var code = "";

    for (var index = 0; index < 5; index++) {
      var digit = Math.floor(Math.random() * 10);
      code += digit + "";
    } //Console.log(code);


    return code;
  }

  done() {
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

}

NewEventCtrl.$name = 'NewEventCtrl';
NewEventCtrl.$inject = ['$state', '$ionicPopup', '$log'];
///////////////////////////////////////////////////////////////////////

}},"filters":{"calendar.filter.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/filters/calendar.filter.js                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.export({
  default: () => CalendarFilter
});
let Moment;
module1.watch(require("moment"), {
  default(v) {
    Moment = v;
  }

}, 0);
let Filter;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Filter(v) {
    Filter = v;
  }

}, 1);

class CalendarFilter extends Filter {
  filter(time) {
    if (!time) return;
    return Moment(time).calendar(null, {
      lastDay: '[Yesterday]',
      sameDay: 'LT',
      lastWeek: 'dddd',
      sameElse: 'DD/MM/YY'
    });
  }

}

CalendarFilter.$name = 'calendar';
///////////////////////////////////////////////////////////////////////

}},"routes.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/scripts/routes.js                                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const module1 = module;
module1.export({
  default: () => RoutesConfig
});
let Config, Runner;
module1.watch(require("angular-ecmascript/module-helpers"), {
  Config(v) {
    Config = v;
  },

  Runner(v) {
    Runner = v;
  }

}, 0);
let eventsTemplateUrl;
module1.watch(require("../templates/events.html"), {
  default(v) {
    eventsTemplateUrl = v;
  }

}, 1);
let newEventTemplateUrl;
module1.watch(require("../templates/newEvent.html"), {
  default(v) {
    newEventTemplateUrl = v;
  }

}, 2);
let editEventTemplateUrl;
module1.watch(require("../templates/editEvent.html"), {
  default(v) {
    editEventTemplateUrl = v;
  }

}, 3);
let tabsTemplateUrl;
module1.watch(require("../templates/tabs.html"), {
  default(v) {
    tabsTemplateUrl = v;
  }

}, 4);

class RoutesConfig extends Config {
  configure() {
    this.$stateProvider.state('tab', {
      url: '/tab',
      abstract: true,
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

}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
///////////////////////////////////////////////////////////////////////

}}},"lib":{"collections.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// lib/collections.js                                                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.export({
  Events: () => Events
});
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const Events = new Mongo.Collection('events');
///////////////////////////////////////////////////////////////////////

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