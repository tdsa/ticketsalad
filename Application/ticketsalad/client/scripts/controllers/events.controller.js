/*
* File Name: events.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: events controller handles all javascript associated with the events html file.
all javascript functions along with the state controllers are placed here.
*/
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events, Notifications } from '../../../lib/collections';
import Moment from 'moment';
import { throws } from 'assert';

export default class EventsCtrl extends Controller 
{
    constructor() 
    {
        super(...arguments);
        let ang = this;

        this.mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          direction: 'horizontal',
          slidesPerView: '1.4',
          centeredSlides: true,
          spaceBetween: 25,
          effect: 'coverflow',
      
          // If we need pagination
          pagination: {
            el: '.swiper-pagination',
          },

          coverflowEffect: {
            rotate: 30,
            slideShadows: false,
          },
  
          observer: true
        });

        this.currentIndex = 0;
        this.claimed = false;
        
        this.helpers({
          data() {
            return Events.find();
          },
          getUser(){
            this.user = Meteor.user();
          },
          checkUser()
          {
              if(Meteor.user() == null)
              {
                  console.log("No user logged in!");
                  this.$state.go('launch');
              }
          }
        });

        this.mySwiper.on('slideChange', function() {
          $(".instruction").text("Enter a unique code...");}
        );

        $("input").keyup(function()
        {
          var tempCode = $(".overlay").val();

          for(i = 1; i <= 6; i++)
          {
            if(tempCode[i - 1] != null)
            {
              $(".dg" + i).css("background-color", "rgb(230, 148, 115)");
              $(".idg" + i).css("background-color", "transparent");
            }
            else
            {
              $(".dg" + i).css("background-color", "rgb(235, 235, 235)");
              $(".idg" + i).css("background-color", "rgb(180, 182, 185)");
            }
          }
      });
    }

    goTo(destination)
    {
      $(".eventsMenu").modal("hide");
      this.$state.go(destination);
    }

    closeMenu()
    {
      $(".eventsMenu").modal("hide");
    }

    resetCode()
    {
      this.code = null;

      for(i = 1; i <= 6; i++)
      {
        $(".dg" + i).css("background-color", "rgb(235, 235, 235)");
        $(".idg" + i).css("background-color", "rgb(180, 182, 185)");
      }
    }

    claim()
    {
      var claimIndex = this.mySwiper.realIndex;

      if(this.claimed == true)
      {
        this.reset();
        return;
      }
      
      var eventFocus = this.data[this.mySwiper.realIndex];
      var userClaims = this.user.profile.credits;
      var eventCost = eventFocus.claims;

      if(eventFocus.claimed == 1)
      {
        console.log("Event already claimed");
        $(".instruction").text("This package has already been claimed!");
        this.resetCode();
        return;
      }

      if(this.code == null)
      {
        console.log("No code entered");
        $(".instruction").text("Enter a code to claim!");
        return;
      }

      console.log("Users balance: " + userClaims);

      if(eventCost > userClaims)
      {
        console.log("Insufficient funds");
        $(".instruction").text("You don't have enough claims!");
        this.resetCode();
        return;
      }

      console.log("User has enough");

      userClaims = userClaims - eventCost;
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});
      userClaims = this.user.profile.credits;
      var dbCode = this.data[claimIndex].code;

      console.log("Debiting users claims balance by " + eventCost);
      console.log("Users new balance: " + userClaims);

      if(!this.data[claimIndex].subscribedUsers.includes(this.user.username))
      {
        Events.update(this.data[claimIndex]._id, {$push: {"subscribedUsers": this.user.username}});
      }

      if(dbCode != this.code)
      {
        console.log("Incorrect code");
        $(".instruction").text("Nope, that's not the one. Try again!");
        this.resetCode();
        return;
      }

      console.log("Correct code");

      $(".instruction").text("Yep, that's the one. Well done!");
      
      Events.update(this.data[claimIndex]._id,{$set: {"claimed": 1, "winner": this.user}});
      Meteor.users.update(this.user._id, {$push: {"profile.tickets": this.data[claimIndex]._id}});
      this.currentIndex = claimIndex;
      this.win();

      console.log("Correct code");
      console.log(Meteor.user().profile.name + " has won the package");

      this.notify();
    }

    win()
    {
      for(i = 1; i <= 6; i++)
      {
        $(".dg" + i).css("background-color", "rgb(182, 234, 130)");
        $(".idg" + i).css("background-color", "transparent");
      }
      $(".greenWin").css("background-color", "rgb(182, 234, 130)");
      $(".filler").css("background-color", "rgb(182, 234, 130)");
      $(".eventsHeader").css("background-color", "rgb(182, 234, 130)");
      $("#hTitle").css("color", "white");
      $(".greenWin").css("z-index", 3);
      $(".claimBtnText").text("Great, Got It");
      this.claimed = true;

      var index = this.mySwiper.realIndex;

      var emailText = "Congratulations, you just won " + this.data[index].tickets + " tickets to " + this.data[index].name + ' - ' + this.data[index].country + ' ' + this.data[index].year;

      Meteor.call(
        'sendEmail',
        'bob@example.com',
        'Congratulations from TicketSalad!',
        emailText
      );
    }

    notify()
    {
      var tempIndex = this.mySwiper.realIndex;

      Notifications.insert(
        {
          type: 'Personal',
          description: 'You won ' + this.data[tempIndex].tickets + ' tickets to ' + this.data[tempIndex].name + ' - ' + this.data[tempIndex].country + ' ' + this.data[tempIndex].year + '. \n Congratulations!',
          picture: this.user.profile.picture,
          eventID: this.data[tempIndex]._id,
          subscribedUsers: [this.user.username],
          timestamp: Moment().toDate(),
        }
      );

      Notifications.insert(
        {
          type: 'Global',
          description: '@' + this.user.username + ' just took home ' + this.data[tempIndex].tickets + ' tickets to ' + this.data[tempIndex].name + ' - ' + this.data[tempIndex].country + ' ' + this.data[tempIndex].year + '.',
          picture: this.user.profile.picture,
          eventID: this.data[tempIndex]._id,
          subscribedUsers: this.data[tempIndex].subscribedUsers,
          timestamp: Moment().toDate(),
        }
      )
    }

    reset()
    {
      $(".greenWin").css("background-color", "white");
      $(".filler").css("background-color", "white");
      $(".eventsHeader").css("background-color", "white");
      $("#hTitle").css("color", "rgb(64, 64, 64)");
      $(".greenWin").css("z-index", 1);
      $(".claimBtnText").text("Claim");
      this.claimed = false;
      this.resetCode();
      return;
    }

    openSearch()
    {
      $(".eventsMenu").modal("hide");
      $('.eventsSearch').modal({inverted: true}).modal('setting', 'transition', 'fade up').modal('show');
    }

    closeSearch()
    {
      $(".eventsSearch").modal("hide");
    }

    findItem(index)
    {
      $(".eventsSearch").modal("hide");
      this.mySwiper.slideTo(index);
    }
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
