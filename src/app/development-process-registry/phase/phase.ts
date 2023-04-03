import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { v4 as uuidv4 } from 'uuid';
import { Equality } from '../../shared/equality';
import { Icon, IconEntry, IconInit } from '../../model/icon';

export interface PhaseInit extends DatabaseInit {
  id?: string;
  name: string;
  description?: string;
  icon?: IconInit;
}

export interface PhaseEntry extends DatabaseEntry {
  id: string;
  name: string;
  description: string;
  icon: IconEntry;
}

export class Phase implements DatabaseModelPart, PhaseInit, Equality<Phase> {
  static readonly defaultIcon: IconInit = { icon: 'bi-kanban' };

  id: string;
  name: string;
  description = '';
  icon: Icon;

  constructor(entry: PhaseEntry | undefined, init: PhaseInit | undefined) {
    let element;
    if (entry != null) {
      element = entry;
      this.icon = new Icon(entry.icon ?? {}, undefined);
    } else if (init != null) {
      element = init;
      this.icon = new Icon(undefined, init.icon ?? Phase.defaultIcon);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id ?? uuidv4();
    this.name = element.name;
    this.description = element.description ?? this.description;
  }

  /**
   * Update this phase with new values
   *
   * @param phase the new values of this phase (values will be copied to the current object)
   */
  update(phase: PhaseInit): void {
    this.id = phase.id ?? this.id;
    this.name = phase.name ?? this.name;
    this.description = phase.description ?? this.description;
  }

  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  toDb(): PhaseEntry {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon.toDb(),
    };
  }

  equals(other: Phase | undefined): boolean {
    return other != null && this.id === other.id && this.name === other.name;
  }
}
