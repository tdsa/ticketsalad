import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class EditEventCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Events.find();
      },
      load()
      {
        this.event = Session.get("editEvent");
        console.log(this.event);
      }
    });

  }

  done()
  {
    Events.update(this.event._id, {

        $set: { 
            name: this.event.name,
            city: this.event.city,
            country: this.event.country,
            from: this.event.from,
            to: this.event.to,
            webpage: this.event.webpage,
            credits: this.event.credits,
            description: this.event.description
        }
  
      });
    this.$state.go("tab.events");
  }

  delete()
  {
    Events.remove(this.event._id);
    this.$state.go("tab.events");
  }

}

EditEventCtrl.$name = 'EditEventCtrl';
EditEventCtrl.$inject = ['$state', '$ionicPopup', '$log'];