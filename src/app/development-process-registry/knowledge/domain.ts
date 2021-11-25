import { DatabaseModel } from '../../database/database-model';

export class Domain extends DatabaseModel {
  static readonly typeName = 'Domain';

  name: string;
  description: string;

  constructor(domain: Partial<Domain>) {
    super(Domain.typeName);
    Object.assign(this, domain);
  }

  /**
   * Update this domain with new values
   *
   * @param domain the new values of this domain (values will be copied to the current object)
   */
  update(domain: Partial<Domain>) {
    Object.assign(this, domain);
  }

  toDb(): any {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
    };
  }
}
