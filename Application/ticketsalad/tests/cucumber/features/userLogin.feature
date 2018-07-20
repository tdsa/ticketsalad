Feature: User Login

As an existing user
I want to be able to login 
So that I can use the application

Background:
    Given I am an existing user
    And I navigate to "/login"

@dev
Scenario: Log in
    when I enter my email "abc@gmail.com" and password "123"
    And I press the login button
    Then I should see the events page
    
