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

    getEvents()
    {
      if(this.text == "" || this.text == false)
      {
        console.log("empty");
        console.log(Events.find());
        /*this.helpers({
          data() {
            return Events.find();
          }
        });*/
      }

      console.log(this.text);
      console.log();
      /*this.helpers({
        data() {
          return Events.find({'name': this.text});
        }
      });*/
    }
    
}
EventsCtrl.$name = 'EventsCtrl';

