import {
  FULL_MATCHES_NUMBER
} from './test_constants';
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Select full dataset', () => {
  it('should select full dataset', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Settings').click();
    /*
     * Page "Settings"
     */
    cy.contains('Settings').should('be.visible');
    cy.contains('Dataset').should('be.visible');
    cy.contains('Standard').should('be.visible');
    cy.contains('Full').should('be.visible');
    cy.contains('Empty').should('be.visible');
    cy.get('input[type="radio"][value="S"]').should('be.checked');
    cy.screenshot('1_settings');
    cy.contains('Full').click();
    cy.contains('Load dataset').click();
    cy.get('input[type="radio"][value="F"]').should('be.checked');
    cy.screenshot('2_settings');
    /*
      * Page "Tournament"
      */
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Tournament').click();
    cy.contains('Tournament').should('be.visible');
    cy.get('table tbody tr').should('have.length', FULL_MATCHES_NUMBER);
    cy.screenshot('3_tournament');
  });
});
