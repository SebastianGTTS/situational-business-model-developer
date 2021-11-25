import { DatabaseModelPart } from '../database/database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseEntry } from '../database/database-entry';

export interface AuthorEntry extends DatabaseEntry {
  name: string;
  company: string;
  email: string;
  website: string;
}

export class Author implements Equality<Author>, DatabaseModelPart {
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
  update(author: Partial<Author>): void {
    Object.assign(this, author);
  }

  toDb(): AuthorEntry {
    return {
      name: this.name,
      company: this.company,
      email: this.email,
      website: this.website,
    };
  }

  equals(other: Author): boolean {
    if (other == null) {
      return false;
    }
    return (
      this.name === other.name &&
      this.company === other.company &&
      this.email === other.email &&
      this.website === other.website
    );
  }
}
