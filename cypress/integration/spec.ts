describe('App runs', () => {
  it('Visit the start page', () => {
    cy.visit('/');
    cy.contains('Situational Business Model Developer');
  });
});
