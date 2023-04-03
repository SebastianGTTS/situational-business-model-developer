import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { Icon, IconEntry, IconInit } from '../../model/icon';

export interface DomainInit extends DatabaseRootInit {
  name: string;
  description?: string;
  icon?: IconInit;
}

export interface DomainEntry extends DatabaseRootEntry {
  name: string;
  description?: string;
  icon: IconEntry;
}

export class Domain extends DatabaseModel implements DomainInit {
  static readonly typeName = 'Domain';
  static readonly defaultIcon: IconInit = { icon: 'bi-box2' };

  name: string;
  description = '';
  icon: Icon;

  constructor(entry: DomainEntry | undefined, init: DomainInit | undefined) {
    super(entry, init, Domain.typeName);
    let element;
    if (entry != null) {
      element = entry;
      this.icon = new Icon(entry.icon ?? {}, undefined);
    } else if (init != null) {
      element = init;
      this.icon = new Icon(undefined, init.icon ?? Domain.defaultIcon);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description ?? this.description;
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

  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  toDb(): DomainEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      icon: this.icon.toDb(),
    };
  }
}
