import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';

export interface DomainInit extends DatabaseRootInit {
  name: string;
  description?: string;
}

export interface DomainEntry extends DatabaseRootEntry {
  name: string;
  description?: string;
}

export class Domain extends DatabaseModel implements DomainInit {
  static readonly typeName = 'Domain';

  name: string;
  description?: string;

  constructor(entry: DomainEntry | undefined, init: DomainInit | undefined) {
    super(entry, init, Domain.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description;
  }

  /**
   * Update this domain with new values
   *
   * @param domain the new values of this domain (values will be copied to the current object)
   */
  update(domain: Partial<Domain>): void {
    this.name = domain.name ?? this.name;
    this.description = domain.description ?? this.description;
  }

  toDb(): DomainEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
    };
  }
}
