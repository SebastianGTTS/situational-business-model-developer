/* eslint-disable @typescript-eslint/no-explicit-any */
import PouchDB from 'pouchdb-browser';

const databaseName = 'bmdlFeatureModeler';

Cypress.Commands.add('initDefaultData', () => {
  cy.initDb('defaultDb');
});

Cypress.Commands.add('initDb', (name) => {
  cy.fixture(name).then(async (data) => {
    const db = new PouchDB(databaseName);
    await db.bulkDocs(data);
    await db.close();
  });
});

Cypress.Commands.add(
  'clickUpdateButton',
  { prevSubject: 'element' },
  (subject) => {
    return cy
      .wrap(subject)
      .should('have.class', 'btn-primary')
      .and('contain.text', '(unsaved changes)')
      .click()
      .should('have.class', 'btn-dark')
      .and('not.contain.text', '(unsaved changes)');
  }
);

Cypress.Commands.add('getPane', (heading) => {
  return cy.contains('div.bg-white.rounded', heading);
});

Cypress.Commands.add('getModal', () => {
  return cy.get('ngb-modal-window');
});
