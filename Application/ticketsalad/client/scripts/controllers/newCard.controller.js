/*
* File Name: buyCredits.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: buyCredits controller handles all javascript associated with the buyCredits html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class NewCardCtrl extends Controller {

    constructor()
    {
        super(...arguments);
    }

    done()
    {
        if (_.isEmpty(this.name)) return;
        if (_.isEmpty(this.acc)) return;
        //if (_.isEmpty(this.month)) return;
        if (_.isEmpty(this.year)) return;
        if (_.isEmpty(this.cvv)) return;

        var details = {"name" : this.name, "acc" : this.acc, "year" : this.year, "cvv" : this.cvv};

        if(this.name != null)
        {
          Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.cards": details}});
        }
        this.$state.go('tab.buyCredits');
    }
  }
 
NewCardCtrl.$name = 'NewCardCtrl';
NewCardCtrl.$inject = ['$state', '$ionicPopup', '$log'];