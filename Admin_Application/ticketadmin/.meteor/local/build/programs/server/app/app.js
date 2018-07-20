var require = meteorInstall({"lib":{"collections.js":function(require,exports,module){

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

}},"server":{"bootstrap.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// server/bootstrap.js                                               //
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
  function generateCode() {
    var code = "";

    for (var index = 0; index < 5; index++) {
      var digit = Math.floor(Math.random() * 10);
      code += digit + "";
    } //Console.log(code);


    return code;
  }
});
///////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/lib/collections.js");
require("/server/bootstrap.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvbGliL2NvbGxlY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYm9vdHN0cmFwLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIkV2ZW50cyIsIk1vbmdvIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsIkNvbGxlY3Rpb24iLCJNb21lbnQiLCJkZWZhdWx0IiwiTWV0ZW9yIiwic3RhcnR1cCIsImdlbmVyYXRlQ29kZSIsImNvZGUiLCJpbmRleCIsImRpZ2l0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPQyxNQUFQLENBQWM7QUFBQ0MsVUFBTyxNQUFJQTtBQUFaLENBQWQ7QUFBbUMsSUFBSUMsS0FBSjtBQUFVSCxPQUFPSSxLQUFQLENBQWFDLFFBQVEsY0FBUixDQUFiLEVBQXFDO0FBQUNGLFFBQU1HLENBQU4sRUFBUTtBQUFDSCxZQUFNRyxDQUFOO0FBQVE7O0FBQWxCLENBQXJDLEVBQXlELENBQXpEO0FBRXRDLE1BQU1KLFNBQVMsSUFBSUMsTUFBTUksVUFBVixDQUFxQixRQUFyQixDQUFmLEM7Ozs7Ozs7Ozs7O0FDRlAsSUFBSUMsTUFBSjtBQUFXUixPQUFPSSxLQUFQLENBQWFDLFFBQVEsUUFBUixDQUFiLEVBQStCO0FBQUNJLFVBQVFILENBQVIsRUFBVTtBQUFDRSxhQUFPRixDQUFQO0FBQVM7O0FBQXJCLENBQS9CLEVBQXNELENBQXREO0FBQXlELElBQUlJLE1BQUo7QUFBV1YsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDSyxTQUFPSixDQUFQLEVBQVM7QUFBQ0ksYUFBT0osQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJSixNQUFKO0FBQVdGLE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSxvQkFBUixDQUFiLEVBQTJDO0FBQUNILFNBQU9JLENBQVAsRUFBUztBQUFDSixhQUFPSSxDQUFQO0FBQVM7O0FBQXBCLENBQTNDLEVBQWlFLENBQWpFO0FBZXpKSSxPQUFPQyxPQUFQLENBQWUsWUFDZjtBQUVJLFdBQVNDLFlBQVQsR0FDQTtBQUNJLFFBQUlDLE9BQU8sRUFBWDs7QUFDQSxTQUFLLElBQUlDLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVEsQ0FBNUIsRUFBK0JBLE9BQS9CLEVBQ0E7QUFDSSxVQUFJQyxRQUFRQyxLQUFLQyxLQUFMLENBQVlELEtBQUtFLE1BQUwsS0FBZ0IsRUFBNUIsQ0FBWjtBQUNBTCxjQUFRRSxRQUFRLEVBQWhCO0FBQ0gsS0FOTCxDQU9JOzs7QUFDQSxXQUFPRixJQUFQO0FBQ0g7QUFDSixDQWRELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcblxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdldmVudHMnKTsiLCIvKlxuKiBGaWxlIE5hbWU6IGJvb3RzdHJhcC5qc1xuKiBWZXJzaW9uIDEuMFxuKlxuKiBUcmlidXMgRGlnaXRhXG4qIFRpY2tldCBTYWxhZFxuKlxuKiBGdW5jdGlvbmFsIGRlc2NyaXB0aW9uOiBib290c3RyYXAgaGFuZGxlcyBhbGwgamF2YXNjcmlwdCBhc3NvY2lhdGVkIHdpdGggY3JlYXRpbmcgYSBtb25nbyBjb2xsZWN0aW9uXG4qL1xuXG4vL2xpYnNcbmltcG9ydCBNb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnLi4vbGliL2NvbGxlY3Rpb25zJztcbiBcbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkgXG57XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKVxuICAgIHtcbiAgICAgICAgdmFyIGNvZGUgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgNTsgaW5kZXgrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWdpdCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkpO1xuICAgICAgICAgICAgY29kZSArPSBkaWdpdCArIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy9Db25zb2xlLmxvZyhjb2RlKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxufSk7Il19
