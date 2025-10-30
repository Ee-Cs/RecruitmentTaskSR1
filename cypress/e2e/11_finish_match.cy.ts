import {
  ADDED_MATCH_NAME,
  ADDED_HOME_TEAM_NAME,
  ADDED_GUEST_TEAM_NAME,
  ADDED_HOME_TEAM_SCORE,
  ADDED_GUEST_TEAM_SCORE,
  MATCHES_NUMBER
} from './test_constants';

/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Finish match', () => {
  it('`should finish match', () => {
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

    const homeTeamAddButton = cy.get('div').contains('Home Team').parent().find('button').contains('Add');
    for (let i = 0; i < ADDED_HOME_TEAM_SCORE + 1; i++) {
      homeTeamAddButton.click();
    }
    cy.get('div').contains('Home Team').parent().find('button').contains('Subtract').click();
    cy.get('input[formcontrolname="homeTeamScore"]').should('have.value', ADDED_HOME_TEAM_SCORE)

    const guestTeamAddButton = cy.get('div').contains('Guest Team').parent().find('button').contains('Add');
    for (let i = 0; i < ADDED_GUEST_TEAM_SCORE + 1; i++) {
      guestTeamAddButton.click();
    }
    cy.get('div').contains('Guest Team').parent().find('button').contains('Subtract').click();
    cy.get('input[formcontrolname="guestTeamScore"]').should('have.value', ADDED_GUEST_TEAM_SCORE)
    cy.screenshot(`2_scoreboard`);
    /*
      * Dialog "Finish match"
      */
    cy.get('button').contains('Finish match').click();
    cy.get('h2').contains('Finish the match?').parent().find('button').contains('Cancel').click();
    // repeating action after cancel
    cy.get('button').contains('Finish match').click();
    cy.screenshot(`3_dialog`);
    cy.get('h2').contains('Finish the match?').parent().find('button').contains('Finish').click();
    /*
      * Page "Scoreboard"
      * Check after finish.
      */
    cy.get('input[formcontrolname="matchName"]').should('have.value', '')
    cy.get('input[formcontrolname="homeTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="homeTeamScore"]').should('have.value', '0')
    cy.get('input[formcontrolname="guestTeamName"]').should('have.value', '')
    cy.get('input[formcontrolname="guestTeamScore"]').should('have.value', '0')
    cy.screenshot(`4_scoreboard`);
    /*
     * Page "Tournament"
     * Check finished team.
     */
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Tournament').click();
    cy.get('table tbody tr').should('have.length', MATCHES_NUMBER + 1);
    cy.get('table tbody tr').first().within(() => {
      cy.get('td')
        .first().contains('1️⃣')
        .next().contains(ADDED_MATCH_NAME)
        .next().contains(ADDED_HOME_TEAM_NAME)
        .next().contains(ADDED_HOME_TEAM_SCORE)
        .next().contains(ADDED_GUEST_TEAM_NAME)
        .next().contains(ADDED_GUEST_TEAM_SCORE);
    });
    cy.screenshot(`5_tournament`);
  });
});
