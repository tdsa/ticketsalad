import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class NewEventCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Events.find();
      }
    });

  }

  generateCode()
  {
      var code = "";
      for (var index = 0; index < 5; index++) 
      {
          var digit = Math.floor((Math.random() * 10));
          code += digit + "";
      }
      //Console.log(code);
      return code;
  }

  done()
  {
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