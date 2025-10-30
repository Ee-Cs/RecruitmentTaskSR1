import {
  ADDED_MATCH_NAME,
  ADDED_HOME_TEAM_NAME,
  ADDED_GUEST_TEAM_NAME,
  ADDED_HOME_TEAM_SCORE,
  ADDED_GUEST_TEAM_SCORE
} from './test_constants';

/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Create match and team', () => {
  it('`should create match and team', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Scoreboard').click();
    /*
      * Page "Scoreboard"
      * Register scores and finish match.
      */
    cy.contains('Scoreboard').should('be.visible');
    cy.contains('Match').should('be.visible');
    cy.get('input[formcontrolname="matchName"]').should('have.value', '')
    cy.contains('Home Team').should('be.visible');
    cy.get('input[formcontrolname="homeTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="homeTeamScore"]').should('have.value', '0')
    cy.contains('Guest Team').should('be.visible');
    cy.get('input[formcontrolname="guestTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="guestTeamScore"]').should('have.value', '0')
    cy.get('button').contains('Delete match');
    cy.get('button').contains('Finish match');
    cy.screenshot(`1_scoreboard`);

    cy.get('input[formcontrolname="matchName"]').type(ADDED_MATCH_NAME);
    cy.get('input[formcontrolname="homeTeamName"]').type(ADDED_HOME_TEAM_NAME);
    cy.get('input[formcontrolname="guestTeamName"]').type(ADDED_GUEST_TEAM_NAME);

    cy.get('div').contains('Home Team').parent().find('button').contains('Add').click();;
    cy.get('input[formcontrolname="homeTeamScore"]').should('have.value', 1)
    cy.get('div').contains('Guest Team').parent().find('button').contains('Add').click();;;
    cy.get('input[formcontrolname="guestTeamScore"]').should('have.value', 1)
    cy.screenshot(`2_scoreboard`);
    /*
      * Dialog "Delete match"
      */
    cy.get('button').contains('Delete match').click();
    cy.get('h2').contains('Delete the match?').parent().find('button').contains('Cancel').click();
    // repeating action after cancel
    cy.get('button').contains('Delete match').click();
    cy.screenshot(`3_dialog`);
    cy.get('h2').contains('Delete the match?').parent().find('button').contains('Delete').click();
    /*
      * Page "Scoreboard"
      * Register scores and finish match.
      */
    cy.contains('Scoreboard').should('be.visible');
    cy.contains('Match').should('be.visible');
    cy.get('input[formcontrolname="matchName"]').should('have.value', '')
    cy.contains('Home Team').should('be.visible');
    cy.get('input[formcontrolname="homeTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="homeTeamScore"]').should('have.value', '0')
    cy.contains('Guest Team').should('be.visible');
    cy.get('input[formcontrolname="guestTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="guestTeamScore"]').should('have.value', '0')
    cy.get('button').contains('Delete match');
    cy.get('button').contains('Finish match');
    cy.screenshot(`4_scoreboard`);
  });
});
