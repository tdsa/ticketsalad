var require = meteorInstall({"Application":{"ticketsalad":{"lib":{"collections.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// Application/ticketsalad/lib/collections.js                        //
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

}},"server":{"bootstrap.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// Application/ticketsalad/server/bootstrap.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
let Moment;
module.watch(require("moment"), {
  default(v) {
    Moment = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Events;
module.watch(require("../lib/collections"), {
  Events(v) {
    Events = v;
  }

}, 2);
Meteor.startup(function () {
  Events.remove({});
  const events = [{
    name: 'Tomorrowland',
    picture: 'img/TL.jpg',
    date: 'July 2018',
    claims: 75
  }, {
    name: 'Rocking The Daisies',
    picture: 'img/RTD.jpg',
    date: 'October 2018',
    claims: 52
  }, {
    name: 'In The City',
    picture: 'img/ITC.png',
    date: 'August 2018',
    claims: 35
  }];
  events.forEach(event => {
    const eventId = Events.insert(event);
  });
});
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/Application/ticketsalad/lib/collections.js");
require("/Application/ticketsalad/server/bootstrap.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvQXBwbGljYXRpb24vdGlja2V0c2FsYWQvbGliL2NvbGxlY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9BcHBsaWNhdGlvbi90aWNrZXRzYWxhZC9zZXJ2ZXIvYm9vdHN0cmFwLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIkV2ZW50cyIsIk1vbmdvIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsIkNvbGxlY3Rpb24iLCJNb21lbnQiLCJkZWZhdWx0IiwiTWV0ZW9yIiwic3RhcnR1cCIsInJlbW92ZSIsImV2ZW50cyIsIm5hbWUiLCJwaWN0dXJlIiwiZGF0ZSIsImNsYWltcyIsImZvckVhY2giLCJldmVudCIsImV2ZW50SWQiLCJpbnNlcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU9DLE1BQVAsQ0FBYztBQUFDQyxVQUFPLE1BQUlBO0FBQVosQ0FBZDtBQUFtQyxJQUFJQyxLQUFKO0FBQVVILE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSxjQUFSLENBQWIsRUFBcUM7QUFBQ0YsUUFBTUcsQ0FBTixFQUFRO0FBQUNILFlBQU1HLENBQU47QUFBUTs7QUFBbEIsQ0FBckMsRUFBeUQsQ0FBekQ7QUFFdEMsTUFBTUosU0FBUyxJQUFJQyxNQUFNSSxVQUFWLENBQXFCLFFBQXJCLENBQWYsQzs7Ozs7Ozs7Ozs7QUNGUCxJQUFJQyxNQUFKO0FBQVdSLE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSxRQUFSLENBQWIsRUFBK0I7QUFBQ0ksVUFBUUgsQ0FBUixFQUFVO0FBQUNFLGFBQU9GLENBQVA7QUFBUzs7QUFBckIsQ0FBL0IsRUFBc0QsQ0FBdEQ7QUFBeUQsSUFBSUksTUFBSjtBQUFXVixPQUFPSSxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiLEVBQXNDO0FBQUNLLFNBQU9KLENBQVAsRUFBUztBQUFDSSxhQUFPSixDQUFQO0FBQVM7O0FBQXBCLENBQXRDLEVBQTRELENBQTVEO0FBQStELElBQUlKLE1BQUo7QUFBV0YsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLG9CQUFSLENBQWIsRUFBMkM7QUFBQ0gsU0FBT0ksQ0FBUCxFQUFTO0FBQUNKLGFBQU9JLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0MsRUFBaUUsQ0FBakU7QUFJekpJLE9BQU9DLE9BQVAsQ0FBZSxZQUNmO0FBQ0lULFNBQU9VLE1BQVAsQ0FBYyxFQUFkO0FBQ0EsUUFBTUMsU0FBUyxDQUNmO0FBQ0lDLFVBQU0sY0FEVjtBQUVJQyxhQUFTLFlBRmI7QUFHSUMsVUFBTSxXQUhWO0FBSUlDLFlBQVE7QUFKWixHQURlLEVBT2Y7QUFDSUgsVUFBTSxxQkFEVjtBQUVJQyxhQUFTLGFBRmI7QUFHSUMsVUFBTSxjQUhWO0FBSUlDLFlBQVE7QUFKWixHQVBlLEVBYWY7QUFDSUgsVUFBTSxhQURWO0FBRUlDLGFBQVMsYUFGYjtBQUdJQyxVQUFNLGFBSFY7QUFJSUMsWUFBUTtBQUpaLEdBYmUsQ0FBZjtBQW9CQUosU0FBT0ssT0FBUCxDQUFnQkMsS0FBRCxJQUFXO0FBQ3RCLFVBQU1DLFVBQVVsQixPQUFPbUIsTUFBUCxDQUFjRixLQUFkLENBQWhCO0FBQ0gsR0FGRDtBQUdILENBMUJELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbiBcbmV4cG9ydCBjb25zdCBFdmVudHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignZXZlbnRzJyk7XG4iLCJpbXBvcnQgTW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJy4uL2xpYi9jb2xsZWN0aW9ucyc7XG4gXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIFxue1xuICAgIEV2ZW50cy5yZW1vdmUoe30pO1xuICAgIGNvbnN0IGV2ZW50cyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdUb21vcnJvd2xhbmQnLFxuICAgICAgICBwaWN0dXJlOiAnaW1nL1RMLmpwZycsXG4gICAgICAgIGRhdGU6ICdKdWx5IDIwMTgnLFxuICAgICAgICBjbGFpbXM6IDc1XG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSb2NraW5nIFRoZSBEYWlzaWVzJyxcbiAgICAgICAgcGljdHVyZTogJ2ltZy9SVEQuanBnJyxcbiAgICAgICAgZGF0ZTogJ09jdG9iZXIgMjAxOCcsXG4gICAgICAgIGNsYWltczogNTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0luIFRoZSBDaXR5JyxcbiAgICAgICAgcGljdHVyZTogJ2ltZy9JVEMucG5nJyxcbiAgICAgICAgZGF0ZTogJ0F1Z3VzdCAyMDE4JyxcbiAgICAgICAgY2xhaW1zOiAzNVxuICAgIH1dO1xuXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50SWQgPSBFdmVudHMuaW5zZXJ0KGV2ZW50KTtcbiAgICB9KTtcbn0pO1xuIl19
