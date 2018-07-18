Feature: Forgot Password

As an existing user
I should be able to make a new password
If I forgot my login details
So that I can use the application

Background:
    when I forgot my password
    And I navigate to "/forgotPassword"

@dev
Scenario:
    Given I forgot my login details
    Then when I press the forgot password link
    Then I should be the forgot password page
    
    
