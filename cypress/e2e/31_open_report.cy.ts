
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Create PDF Reports', () => {
  it('should create PDF report', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Create PDF Reports').click();
    /*
      * Page "Reports"
      */
    cy.contains('Reports').should('be.visible');
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('button').contains('Open PDF').click();
    cy.wait(500);// wait for PDF generation
    cy.get('@windowOpen').should('have.been.called');
    cy.get('button').contains('Print PDF').should('be.visible');
    cy.get('button').contains('Download PDF').should('be.visible');
    cy.screenshot(`1_pdf_reports`);
  });
});
