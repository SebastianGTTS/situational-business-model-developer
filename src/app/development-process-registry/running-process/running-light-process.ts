import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import {
  Selection,
  SelectionEntry,
  SelectionInit,
} from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';

export interface RunningLightProcessInit extends RunningProcessInit {
  domains?: DomainInit[];
  situationalFactors?: SelectionInit<SituationalFactorInit>[];
}

export interface RunningLightProcessEntry extends RunningProcessEntry {
  domains: DomainEntry[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];
}

export class RunningLightProcess extends RunningProcess {
  domains: Domain[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  constructor(
    entry: RunningLightProcessEntry | undefined,
    init: RunningLightProcessInit | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.domains =
        entry.domains?.map((domain) => new Domain(domain, undefined)) ??
        this.domains;
      this.situationalFactors =
        entry.situationalFactors?.map(
          (factor) =>
            new Selection<SituationalFactor>(
              factor,
              undefined,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    } else if (init != null) {
      this.domains =
        init.domains?.map((domain) => new Domain(undefined, domain)) ??
        this.domains;
      this.situationalFactors =
        init.situationalFactors?.map(
          (factor) =>
            new Selection<SituationalFactor>(
              undefined,
              factor,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): RunningLightProcessEntry {
    return {
      ...super.toDb(),
      domains: this.domains.map((domain) => domain.toDb()),
      situationalFactors: this.situationalFactors.map((factor) =>
        factor.toDb()
      ),
    };
  }
}

export function isRunningLightProcess(
  runningProcess: RunningProcess
): runningProcess is RunningLightProcess {
  return (runningProcess as RunningLightProcess).domains != null;
}

export function isRunningLightProcessEntry(
  runningProcess: RunningProcessEntry
): runningProcess is RunningLightProcessEntry {
  return (runningProcess as RunningLightProcessEntry).domains != null;
}
