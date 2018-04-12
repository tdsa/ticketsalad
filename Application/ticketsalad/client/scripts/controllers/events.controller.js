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


    getEvents(text)
    {
      //console.log("reached");
      console.log(text);
      this.helpers({
        data() {
          return Events.find({'name': ""});
        }
      });

      other = data;
      data = temp;
    }

    remove()
    {
      Events.remove(1);
    }

    getItems(text)
    {
      if(text == "")
      {
        return;
      }
      else
      {
        this.getEvents(text);
      }
    }
}
EventsCtrl.$name = 'EventsCtrl';
