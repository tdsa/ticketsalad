import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Events.find();
      }
    });

  }

  createNew()
  {
    console.log("new");
    this.$state.go('tab.newEvent');
    console.log("gone");
  }

  loadEvent(event)
  {
    console.log("Loading event");
    Session.set("editEvent",event);
  }
}

EventsCtrl.$name = 'EventsCtrl';
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];