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
      var text = angular.element(document.getElementById('search')).val();

      if(text == "" || text == false)
      {
        this.helpers({
          data() {
            return Events.find();
          }
        });
      }

      console.log(text);
      console.log();
      this.helpers({
        data() {
          return Events.find({'name': text});
        }
      });
    }
}
EventsCtrl.$name = 'EventsCtrl';
