Feature: Forgot Password

As an existing user
I should be able to make a new password
If I forgot my login details
So that I can use the application

Background:
    Given I am an existing user
    when I forgot my password
    And I navigate to "/forgotPassword"

@dev
Scenario:
    when I press the forgot password link
    Then I should be in the forgot password page
    when I enter my email "abc@gmail.com" and new password "456"
    And I submit the form 
    Then I should see the events page

    
