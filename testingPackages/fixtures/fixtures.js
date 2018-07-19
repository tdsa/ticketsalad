Meteor.methods({

    'fixtures/reset': function () { //Resets all the users in the database
      Meteor.users.remove({});
    },
  
    'fixtures/seedData': function () {
      Accounts.createUser({
        email: "abc@gmail.com",
        password: "123"
      }); 
    }
  
  });
  