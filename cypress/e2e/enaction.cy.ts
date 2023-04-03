const selectNewArtifact = (name: string, text: string): void => {
  cy.contains('New Artifact').click();
  cy.get('#name').clear();
  cy.get('#name').type(name);
  cy.get('#externalOutputArtifactData > .ql-container > .ql-editor > p')
    .click()
    .type(text);
};

describe('Enaction', () => {
  it('enact text only', () => {
    cy.initDefaultData();
    cy.visit('/runningprocess');
    cy.contains('.list-group-item', 'OWL Culture').contains('View').click();
    cy.contains('Start').click();
    cy.contains('.col', 'Doing')
      .find('.card')
      .should('contain.text', 'Target Audience Identification');
    cy.contains('View Execution').click();
    cy.contains('Confirm').click();
    selectNewArtifact('Customer Information', 'Customer Information 1');
    cy.contains('.btn', 'Finish execution').should('be.disabled');
    cy.contains('.btn', 'Update Artifacts').should('have.class', 'btn-primary');
    cy.contains('.btn', 'Update Artifacts').click();
    cy.contains('.btn', 'Update Artifacts').should('have.class', 'btn-dark');
    cy.contains('.btn', 'Finish execution').should('be.enabled');
    cy.contains('.btn', 'Finish execution').click();
    cy.contains('.card', 'Store Trend Discovery')
      .contains('.btn', 'Start')
      .click();
    cy.contains('.col', 'Doing')
      .find('.card')
      .should('contain.text', 'Store Trend Discovery');
    cy.contains('.card', 'Store Trend Discovery')
      .contains('.btn', 'View Execution')
      .click();
    cy.contains('Confirm').click();
    selectNewArtifact('Problem Information', 'Problem Information 1');
    cy.contains('.btn', 'Update Artifacts').click();
    cy.contains('.btn', 'Finish execution').click();
    cy.contains('Start').click();
    cy.contains('View Execution').click();
    cy.contains('Confirm').click();
    cy.get('#artifact').select('0: 1');
    cy.get(
      '#externalOutputArtifactData > .ql-container > .ql-editor > p'
    ).should('have.text', 'Problem Information 1');
    cy.get('#externalOutputArtifactData > .ql-container > .ql-editor > p')
      .click()
      .type('{enter}Problem Information 2');
    cy.contains('.btn', 'Update Artifacts').click();
    cy.get('[ng-reflect-router-link="/,runningprocess,runningproces"]').click();
    cy.contains('View Execution').click();
    cy.get('#externalOutputArtifactData > .ql-container > .ql-editor').should(
      'have.text',
      'Problem Information 1Problem Information 2'
    );
    cy.contains('.btn', 'Finish execution').click();
    cy.contains('.list-group-item', 'Problem Information')
      .contains('Version #2')
      .click();
    cy.get('.ql-editor').should(
      'have.text',
      'Problem Information 1Problem Information 2'
    );
  });

  it('enact steps', () => {
    cy.initDefaultData();
    cy.visit('/runningprocess');
    cy.contains('.list-group-item', 'Example Canvas Creation')
      .contains('View')
      .click();
    cy.contains('.btn', 'Start').click();
    cy.contains('.btn', 'View Execution').click();
    cy.contains('.btn', 'Confirm').click();
    cy.contains('.btn', 'Execute next step').click();
    cy.get('#name').clear();
    cy.get('#name').type('TestInstance');
    cy.contains('.btn', 'Create Canvas Artifact').click();
    cy.contains('.btn', 'Execute next step').click();
    cy.contains('app-canvas-building-block', 'Products & Services')
      .find('[aria-label="Add Feature"]')
      .click();
    cy.get('#name').clear();
    cy.get('#name').type('Test');
    cy.get('app-add-decision-modal').contains('.btn', 'Add').click();
    cy.get('.close > span').click();
    cy.contains('app-canvas-building-block', 'Products & Services').should(
      'contain.text',
      'Test'
    );
    cy.contains('.btn', 'Finish editing').click();
    cy.contains('.btn', 'Execute next step').click();
    cy.contains('.btn', 'Finish refinement').click();
    cy.contains('New Artifact').click();
    cy.get('#name').clear();
    cy.get('#name').type('Test');
    cy.contains('Update Artifacts').should('have.class', 'btn-primary');
    cy.contains('Update Artifacts').click();
    cy.contains('Update Artifacts').should('have.class', 'btn-dark');
    cy.contains('Finish execution').click();
  });

  it('reports incomplete building block', () => {
    cy.initDb('compositionDb');
    cy.visit('/runningprocess/runningprocessview/1635786550057');
    cy.contains('.btn', 'Add').click();
    cy.get(
      ':nth-child(1) > app-development-method-selection-form > .d-flex > .btn'
    ).click();
    cy.get(
      'app-development-method-incomplete-modal > .modal-header > .modal-title'
    ).should('have.text', 'Building Block incomplete');
    cy.get('.modal-footer > .btn-dark').click();
    cy.get('.modal-title').should(
      'have.text',
      'Select Method Building Block to add to TODO'
    );
    cy.get(
      ':nth-child(2) > app-development-method-selection-form > .d-flex > .btn'
    ).click();
    cy.get('.modal-title').should(
      'have.text',
      ' Configure Building Block Complete '
    );
  });
});
