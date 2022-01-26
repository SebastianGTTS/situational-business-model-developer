import {
  FeatureModel,
  FeatureModelEntry,
  FeatureModelInit,
  FeatureModelJsonSchema,
} from './feature-model';
import { Instance, InstanceType } from './instance';
import {
  Domain,
  DomainEntry,
  DomainInit,
} from '../development-process-registry/knowledge/domain';

export interface ExpertModelInit extends FeatureModelInit {
  domains?: DomainInit[];
  version?: string;
}

export interface ExpertModelEntry extends FeatureModelEntry {
  domains: DomainEntry[];
  version: string;
}

interface ExpertModelJsonSchema extends FeatureModelJsonSchema {
  version: string;
}

export class ExpertModel extends FeatureModel implements ExpertModelInit {
  static readonly typeName = 'ExpertModel';

  domains: Domain[] = [];
  version: string;

  constructor(
    entry: ExpertModelEntry | undefined,
    init: ExpertModelInit | undefined
  ) {
    super(entry, init, ExpertModel.typeName);
    if (entry != null) {
      this.domains =
        entry.domains?.map((domain) => new Domain(domain, undefined)) ??
        this.domains;
      this.version = entry.version;
    } else if (init != null) {
      this.domains =
        init.domains?.map((domain) => new Domain(undefined, domain)) ??
        this.domains;
      this.version = init.version;
    }
  }

  update(expertModel: Partial<ExpertModel>): void {
    super.update(expertModel);
    if (expertModel.version !== undefined) {
      this.version = expertModel.version;
    }
  }

  updateDomains(domains: DomainInit[]): void {
    this.domains = domains.map((domain) => new Domain(undefined, domain));
  }

  getExamples(): Instance[] {
    return this.instances.filter(
      (instance) => instance.type === InstanceType.EXAMPLE
    );
  }

  getPatterns(): Instance[] {
    return this.instances.filter(
      (instance) => instance.type === InstanceType.PATTERN
    );
  }

  toDb(): ExpertModelEntry {
    return {
      ...super.toDb(),
      domains: this.domains.map((domain) => domain.toDb()),
      version: this.version,
    };
  }

  toJSON(): ExpertModelJsonSchema {
    return {
      ...super.toJSON(),
      version: this.version,
    };
  }
}
