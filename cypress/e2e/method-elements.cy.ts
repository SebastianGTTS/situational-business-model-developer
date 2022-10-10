describe('Create Method Elements', () => {
  it('Create Type', () => {
    cy.visit('/types');
    cy.get('#name').type('MyTestType');
    cy.get('#list').type('MyTestList');
    cy.get('button[type=submit]').click();
    cy.get(':nth-child(1) > :nth-child(2) > .my-3 > .border-bottom').should(
      'have.text',
      'MyTestList'
    );
    cy.get(':nth-child(1) > span').should('have.text', 'MyTestType');
    cy.get(':nth-child(2) > .btn-dark').click();
    cy.get('#description').click().type('TestDescription');
    cy.get('.col-sm-12 > .btn').should('have.class', 'btn-primary');
    cy.get('.btn > span').click();
    cy.get('.col-sm-12 > .btn').should('have.class', 'btn-dark');
  });

  it('Create Situational Factor', () => {
    cy.visit('/situationalFactors');
    cy.get('#name').clear();
    cy.get('#name').type('TestFactor');
    cy.get('#list').clear();
    cy.get('#list').type('TestList');
    cy.get('.col-sm-12 > .btn').click();
    cy.get(':nth-child(1) > :nth-child(2) > .my-3 > .border-bottom').should(
      'have.text',
      'TestList'
    );
    cy.get(':nth-child(1) > span').should('have.text', 'TestFactor');
    cy.get(':nth-child(2) > .btn-dark').click();
    cy.get('app-form-array-list > .d-flex > .btn').click();
    cy.get('#elementName').clear();
    cy.get('#elementName').type('Low');
    cy.get('app-form-array-list > .d-flex > .btn').click();
    cy.get(':nth-child(2) > .col-sm-8 > #elementName').clear();
    cy.get(':nth-child(2) > .col-sm-8 > #elementName').type('Medium');
    cy.get('app-form-array-list > .d-flex > .btn').click();
    cy.get(':nth-child(3) > .col-sm-8 > #elementName').clear();
    cy.get(':nth-child(3) > .col-sm-8 > #elementName').type('High');
    cy.get('.btn > span').should('have.text', ' (unsaved changes)');
    cy.get(':nth-child(3) > .col-sm-12 > .btn').should(
      'have.class',
      'btn-primary'
    );
    cy.get('.btn > span').click();
    cy.get(':nth-child(3) > .col-sm-12 > .btn').should(
      'have.class',
      'btn-dark'
    );
    cy.get('.btn-group > :nth-child(2)').click();
    cy.get('.focus > input').check();
    cy.get(
      ':nth-child(1) > .col-sm-8 > .input-group-append > [disabled=""]'
    ).should('have.text', ' Up ');
    cy.get('#description').click().type('Test Description');
    cy.get(
      'app-description-form > form.ng-valid > .row > .col-sm-12 > .btn'
    ).should('have.class', 'btn-primary');
    cy.get('.btn > span').should('have.text', ' (unsaved changes)');
    cy.get(
      'app-description-form > form.ng-valid > .row > .col-sm-12 > .btn'
    ).click();
    cy.get(
      'app-description-form > .ng-submitted > .row > .col-sm-12 > .btn'
    ).should('have.class', 'btn-dark');
  });
});
