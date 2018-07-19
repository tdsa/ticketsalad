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
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller 
{
    constructor() 
    {
        super(...arguments);

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

          getUser()
          {
            this.user = Meteor.user();
          },
        });

        this.mySwiper.on('slideChange', function() {$(".instruction").text("Enter a unique code...");});

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

    check()
    {
      if(!Meteor.user())
      {
        window.location.href = '#/login';
        this.$state.go('login');
      }

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
      if(this.claimed == true)
      {
        this.reset();
        return;
      }

      Meteor.users.update(this.user._id, {$set: {"profile.credits": 5}});
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
        console.log("Please enter a code");
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

      console.log("Enough");

      userClaims = userClaims - eventCost;
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});
      userClaims = this.user.profile.credits;
      var dbCode = this.data[this.mySwiper.realIndex].code;

      if(dbCode != this.code)
      {
        console.log("Incorrect code, try again!");
        $(".instruction").text("Nope, that's not the one. Try again!");
        this.resetCode();
        return;
      }
      $(".instruction").text("Yep, that's the one. Well done!");
      
      Events.update(this.data[this.mySwiper.realIndex]._id,{$set: {"claimed": 1, "winner": this.user}});
      this.currentIndex = this.mySwiper.realIndex;
      this.win();
      console.log("Congratulations! you won, your balance is now " + userClaims);
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
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
