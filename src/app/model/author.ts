import { DatabaseModelPart } from '../database/database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseEntry, DatabaseInit } from '../database/database-entry';

export interface AuthorInit extends DatabaseInit {
  name?: string;
  company?: string;
  email?: string;
  website?: string;
}

export interface AuthorEntry extends DatabaseEntry {
  name: string;
  company: string;
  email: string;
  website: string;
}

export class Author implements AuthorInit, Equality<Author>, DatabaseModelPart {
  // JSON Schema (stored)
  name: string;
  company: string;
  email: string;
  website: string;

  constructor(entry: AuthorEntry | undefined, init: AuthorInit | undefined) {
    const element = entry ?? init;
    this.name = element.name;
    this.company = element.company;
    this.email = element.email;
    this.website = element.website;
  }

  /**
   * Update this author with new values
   *
   * @param author the new values of this author (values will be copied to the current object)
   */
  update(author: Partial<AuthorInit>): void {
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
