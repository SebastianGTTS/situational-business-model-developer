import Chainable = Cypress.Chainable;

const expertModels = (): Chainable => {
  return cy.getPane('Canvas Building Blocks');
};

const modelInfo = (): Chainable => {
  return cy.getPane('Info');
};

const authorInfo = (): Chainable => {
  return cy.getPane('Author Info');
};

describe('Expert Models', () => {
  it('import expert model', () => {
    cy.fixture('expertModel').then((model) => {
      cy.visit('http://localhost:4200/expertModels/');
      cy.contains('div.bg-white', 'Import Canvas Building Block').within(() => {
        cy.get('input[type=file]').then((element) => {
          const input = element as JQuery<HTMLInputElement>;
          const file = new File([JSON.stringify(model)], 'Test.json', {
            type: 'application/json',
          });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.get()[0].files = dataTransfer.files;
          input.get()[0].dispatchEvent(new Event('change'));
        });
        cy.contains('.btn', 'Import Canvas Building Block').click();
      });
    });
    expertModels().within(() => {
      cy.get('li').should('contain.text', 'Mobile Todo-Apps');
      cy.contains('.btn', 'View').click();
    });
    modelInfo().within(() => {
      cy.contains('tr', 'Name')
        .find('td')
        .should('have.text', 'Mobile Todo-Apps');
      cy.contains('tr', 'Description')
        .find('td')
        .should(
          'have.text',
          'An example of expert knowledge about mobile Todo-Apps'
        );
    });
    cy.contains('.nav-link', '3. Create Patterns and Examples').click();
    cy.contains('div.bg-white', 'Example Instances').within(() => {
      cy.get('li').should('have.length', 6);
    });
  });

  it('Add expert model', () => {
    cy.initDb('canvasDefinitionDb');
    cy.visit('http://localhost:4200/expertModels/');
    cy.get('#definitionSelector').select('0: Object');
    cy.get('#name').clear();
    cy.get('#name').type('Test Model');
    cy.get('#description').clear();
    cy.get('#description').type('Test Description');
    cy.contains('.btn', 'Add Canvas Building Block').click();
    expertModels().within(() => {
      cy.get('.text-gray-dark').should('have.text', 'Test Model');
      cy.contains('.btn', 'View').click();
    });
    cy.get('app-author-form #name').clear();
    cy.get('app-author-form #name').type('Test Author');
    cy.contains('.btn', 'Update Author Info').clickUpdateButton();
    authorInfo().within(() => {
      cy.contains('tr', 'Name').find('td').should('have.text', 'Test Author');
    });
    cy.contains('.nav-link', '2. Edit').click();
    cy.contains('.btn', 'Edit Canvas Building Block').click();
    cy.get('#name').clear();
    cy.get('#name').type('Test Feature A');
    cy.get('#description').clear();
    cy.get('#description').type('My Feature Description');
    cy.contains('.btn', 'Add Feature').click();
    cy.getPane('Feature tree').within(() => {
      cy.contains('li', 'Key Partners').within(() => {
        cy.contains('div', 'Test Feature A')
          .find('small')
          .should('have.text', ' My Feature Description');
        cy.contains('li', 'Test Feature A').contains('.btn', 'Update').click();
      });
    });
    cy.getModal().within(() => {
      cy.get('#subfeatureOf').select(2);
      cy.get('#type').select('Yes');
      cy.contains('.btn', 'Update Feature').click();
    });
    cy.getPane('Feature tree').within(() => {
      cy.contains('li', 'Key Activities').within(() => {
        cy.contains('li', 'Test Feature A').within(() => {
          cy.get('div > :first-child > i').should(
            'have.attr',
            'title',
            'mandatory'
          );
        });
      });
    });
  });

  it('Add cross tree relationship', () => {
    cy.initDb('expertModelDb');
    cy.visit('/expertModels/1635594633414/edit');
    cy.get('#relationshipType').select('1: excludes');
    cy.get('#fromFeatureId').select('1: test-feature-a');
    cy.get('#toFeatureId').select('3: test-feature-b');
    cy.get(':nth-child(4) > .col-sm-12 > .btn').click();
    cy.get('.pt-3 > div > .btn').click();
    cy.get(
      ':nth-child(1) > :nth-child(3) > :nth-child(1) > .flex-wrap > :nth-child(2) > .btn-warning'
    ).click();
    cy.get(
      '.modal-body > .text-muted > app-feature-form > form.ng-untouched > :nth-child(4) > .col-sm-8 > #type'
    ).select('0: mandatory');
    cy.get(
      '.modal-body > .text-muted > app-feature-form > form.ng-untouched > :nth-child(6) > .col-sm-12 > .btn'
    ).click();
    cy.get('.pt-3 > :nth-child(2) > ul > li').should(
      'have.text',
      ' Test Feature A excludes the feature Test Feature B, but both features have to be included '
    );
    cy.get(':nth-child(2) > .text-danger').should('have.class', 'text-danger');
  });
});
