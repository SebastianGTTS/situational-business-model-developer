import { FeatureModel } from './feature-model';
import { Instance, InstanceType } from './instance';
import { Domain } from '../development-process-registry/knowledge/domain';

export class ExpertModel extends FeatureModel {

  static readonly typeName = 'ExpertModel';

  domains: Domain[];
  version: string;

  constructor(expertModel: Partial<ExpertModel>) {
    super(expertModel, ExpertModel.typeName);
    this.domains = this.domains.map((domain) => new Domain(domain));
  }

  protected init() {
    super.init();
    this.domains = [];
  }

  update(expertModel: Partial<ExpertModel>) {
    super.update(expertModel);
    if (expertModel.version !== undefined) {
      this.version = expertModel.version;
    }
  }

  updateDomains(domains: Partial<Domain>[]) {
    this.domains = domains.map((domain) => new Domain(domain));
  }

  getExamples(): Instance[] {
    return this.instances.filter((instance) => instance.type === InstanceType.EXAMPLE);
  }

  getPatterns(): Instance[] {
    return this.instances.filter((instance) => instance.type === InstanceType.PATTERN);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      domains: this.domains.map((domain) => domain.toPouchDb()),
      version: this.version,
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      version: this.version,
    };
  }

}
