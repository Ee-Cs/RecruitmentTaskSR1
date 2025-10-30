import {
  MATCHES_NUMBER,
  MATCH_NAME,
  HOME_TEAM_NAME,
  GUEST_TEAM_NAME,
  HOME_TEAM_SCORE,
  GUEST_TEAM_SCORE,
} from './test_constants';
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Check tournament', () => {
  it('`should display tournament matches and teams', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Tournament').click();
    /*
      * Page "Tournament"
      */
    cy.contains('Tournament').should('be.visible');
    cy.get('table thead tr').should('have.length', 2);
    cy.get('table thead').within(() => {
      cy.get('tr').first().within(() => {
        cy.get('th')
          .first().contains('Position')
          .next().contains('Match Name')
          .next().contains('Home Team')
          .next().contains('Guest Team');
      });
      cy.get('tr').last().within(() => {
        cy.get('th')
          .first().contains('Name')
          .next().contains('Score')
          .next().contains('Name')
          .next().contains('Score');
      });
    });
    cy.get('table tbody tr').should('have.length', MATCHES_NUMBER);
    cy.get('table tbody tr').first().within(() => {
      cy.get('td')
        .first().contains('1️⃣')
        .next().contains(MATCH_NAME)
        .next().contains(HOME_TEAM_NAME)
        .next().contains(HOME_TEAM_SCORE)
        .next().contains(GUEST_TEAM_NAME)
        .next().contains(GUEST_TEAM_SCORE);
    });
    cy.screenshot(`1_tournament`);
  });
});
