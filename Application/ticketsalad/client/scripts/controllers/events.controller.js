import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller 
{
    constructor() 
    {
        super(...arguments);
        
        this.helpers({
          data() {
            return Events.find();
          }
        });
    }


    focusEvent(event)
    {
      console.log(event);
      this.focusevent = event;
    }

    check()
  {
    if(!Meteor.user())
    {
      window.location.href = '#/login';
      this.$state.go('login');
    }
  }

}
EventsCtrl.$name = 'EventsCtrl';

