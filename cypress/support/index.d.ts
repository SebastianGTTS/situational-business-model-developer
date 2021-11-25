declare namespace Cypress {
  interface Chainable {
    /**
     * Init the database with default data
     */
    initDefaultData(): Chainable;

    /**
     * Init the database with a specific db file
     *
     * @param name the name of the db file
     */
    initDb(name: string): Chainable;

    /**
     * Click a button that updates the current pane and checks that the button
     * displays changes correctly
     */
    clickUpdateButton(): Chainable;

    /**
     * Get a pane with a specific heading
     *
     * @param heading the heading of the pane
     */
    getPane(heading: string): Chainable;

    /**
     * Get the current modal
     */
    getModal(): Chainable;
  }
}
