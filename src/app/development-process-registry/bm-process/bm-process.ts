import { Icon, IconEntry, IconInit } from '../../model/icon';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { DatabaseModel } from '../../database/database-model';
import { Selection, SelectionEntry } from '../development-method/selection';
import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../method-elements/situational-factor/situational-factor';

export interface BmProcessInit extends DatabaseRootInit {
  initial?: boolean;
  name: string;
  description?: string;
  icon?: IconInit;
  domains?: DomainInit[];
  situationalFactors?: Selection<SituationalFactor>[];
}

export interface BmProcessEntry extends DatabaseRootEntry {
  initial: boolean;
  name: string;
  description: string;
  icon: IconEntry;
  domains: DomainEntry[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];
}

export class BmProcess extends DatabaseModel {
  static readonly typeName = 'BmProcess';

  initial = true;
  name: string;
  description = '';
  icon: Icon;

  domains: Domain[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  constructor(
    entry: BmProcessEntry | undefined,
    init: BmProcessInit | undefined
  ) {
    super(entry, init, BmProcess.typeName);
    let element;
    if (entry != null) {
      element = entry;
      this.icon = new Icon(entry.icon ?? {}, undefined);
      this.domains =
        entry.domains?.map((domain) => new Domain(domain, undefined)) ??
        this.domains;
      this.situationalFactors =
        entry.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              selection,
              undefined,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    } else if (init != null) {
      element = init;
      this.icon = new Icon(undefined, init.icon ?? {});
      this.domains =
        init.domains?.map((domain) => new Domain(undefined, domain)) ??
        this.domains;
      this.situationalFactors =
        init.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              undefined,
              selection,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.initial = element.initial ?? this.initial;
    this.name = element.name;
    this.description = element.description ?? this.description;
  }

  /**
   * Finish the initialization process of a bm process, i.e.,
   * the context selection is finished.
   */
  finishInitialization(): void {
    this.initial = false;
  }

  /**
   * Update the name and description of this bm process
   *
   * @param name
   * @param description
   */
  updateInfo(name: string, description: string): void {
    this.name = name;
    this.description = description;
  }

  /**
   * Update the icon of this bm process
   *
   * @param icon
   */
  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  /**
   * Checks whether all method decisions are correctly filled out, except for the step decisions.
   */
  isComplete(): boolean {
    throw new Error('Not implemented');
  }

  toDb(): BmProcessEntry {
    return {
      ...super.toDb(),
      initial: this.initial,
      name: this.name,
      description: this.description,
      icon: this.icon.toDb(),
      domains: this.domains.map((domain) => domain.toDb()),
      situationalFactors: this.situationalFactors.map((selection) =>
        selection.toDb()
      ),
    };
  }
}
