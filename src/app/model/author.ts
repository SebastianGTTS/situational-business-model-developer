export class Author {

  // JSON Schema (stored)
  name: string;
  company: string;
  email: string;
  website: string;

  constructor(author: Partial<Author>) {
    Object.assign(this, author);
  }

  /**
   * Update this author with new values
   *
   * @param author the new values of this author (values will be copied to the current object)
   */
  update(author: Partial<Author>) {
    Object.assign(this, author);
  }

  toPouchDb(): any {
    return {
      name: this.name,
      company: this.company,
      email: this.email,
      website: this.website
    };
  }

}
