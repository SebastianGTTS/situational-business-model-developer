describe('Composition', () => {
  it('report incomplete building blocks', () => {
    cy.initDb('compositionDb');
    cy.visit('/bmprocess/bmprocessview/1635786513910');
    cy.get(':nth-child(4) > .djs-element > .djs-hit').click();
    cy.get('[data-group="edit"] > .entry').click();
    cy.get(
      ':nth-child(1) > app-development-method-selection-form > .d-flex > .btn'
    ).click();
    cy.get(
      'app-development-method-incomplete-modal > .modal-header > .modal-title'
    ).should('have.text', 'Building Block incomplete');
    cy.get('.modal-footer > .btn-primary').click();
    cy.url().should('include', '/methods/methodview/1635786343509');
  });

  it('insert methods', () => {
    cy.initDb('compositionDb');
    cy.visit('/bmprocess/bmprocessview/1635786513910');
    cy.get(':nth-child(4) > .djs-element > .djs-hit').click();
    cy.get('[data-group="edit"] > .entry').click();
    cy.get(
      ':nth-child(2) > app-development-method-selection-form > .d-flex > .btn'
    ).click();
    cy.contains('g', 'Complete')
      .find('rect')
      .should('have.css', 'stroke', 'rgb(255, 165, 0)');
  });
});
