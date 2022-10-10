describe('Building Blocks', () => {
  it('create building block', () => {
    cy.initDb('buildingBlockDb');
    cy.visit('/methods');
    cy.get('#name').type('Test Building Block');
    cy.contains('.btn', 'Add Method Building Block').click();
    cy.getPane('Method Building Blocks').within(() => {
      cy.get('.list-group-item').should('contain.text', 'Test Building Block');
      cy.contains('.btn', 'View').click();
    });
    cy.get('.alert-success').should(
      'contain.text',
      'This Method Building Block is correctly defined.'
    );
    cy.getPane('Types').within(() => {
      cy.contains('.btn', 'Add Type').click();
      cy.contains('.btn', 'Update').should('be.disabled');
      cy.get('#elementInput').type('bm');
      cy.contains('button', 'bmDesign').click();
      cy.contains('.btn', 'Update').should('be.enabled');
      cy.contains('.btn', 'Update').should('contain.text', '(unsaved changes)');
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
      cy.get('#listInput').should('contain.value', 'design');
    });
    cy.getPane('Situational Factors').within(() => {
      cy.contains('.btn', 'Add Situational Factor').click();
      cy.get('#listInput').type('Comp');
      cy.contains('button', 'Company').click();
      cy.get('#elementInput').click();
      cy.contains('button', 'businessModelingSkills').click();
      cy.get('#factorValue').select('medium');
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
    });
    cy.getPane('Input Artifacts').within(() => {
      cy.contains('.btn', 'Add OR Group').click();
      cy.contains('.btn', 'Set Default').click();
      cy.getPane('Group (default group)').within(() => {
        cy.contains('.btn', 'Add Artifact').click();
        cy.get('#elementInput').click();
        cy.contains('button', 'Business Model Canvas').click();
        cy.contains('.btn', 'Add Mapping').should('be.enabled');
      });
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
    });
    cy.getPane('Output Artifacts').within(() => {
      cy.contains('.btn', 'Add OR Group').click();
      cy.contains('.btn', 'Set Default').click();
      cy.getPane('Group (default group)').within(() => {
        cy.contains('.btn', 'Add Artifact').click();
        cy.get('#elementInput').click();
        cy.contains('button', 'Business Model Canvas').click();
      });
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
    });
    cy.getPane('Tools').within(() => {
      cy.contains('.btn', 'Add OR Group').click();
      cy.contains('.btn', 'Set Default').click();
      cy.getPane('Group (default group)').within(() => {
        cy.contains('.btn', 'Add Tool').click();
        cy.get('#elementInput').click();
        cy.contains('button', 'Canvas Module').click();
      });
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
    });
    cy.getPane('Execution steps').within(() => {
      cy.contains('.btn', 'Add execution step').click();
      cy.getPane('Step #1').within(() => {
        cy.get('#moduleInput').click();
        cy.contains('button', 'Canvas Module').click();
        cy.get('#methodInput').click();
        cy.contains('button', 'createCanvas').click();
        cy.get('#definitionSelector').select('Business Model Canvas');
        cy.contains('.btn', 'Add Mapping').click();
        cy.get('#selectOutput-0').select('Output');
        cy.get('#inputGroup-0').select('#1');
        cy.get('#inputArtifact-0').select('#1 Business Model Canvas');
      });
      cy.contains('.btn', 'Update').click();
      cy.contains('.btn', 'Update').should(
        'not.contain.text',
        '(unsaved changes)'
      );
    });
    cy.get('.alert-success').should(
      'contain.text',
      'This Method Building Block is correctly defined.'
    );
  });
});
