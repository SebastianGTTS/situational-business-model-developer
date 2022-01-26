import { Injectable } from '@angular/core';
import { Domain, DomainInit } from './domain';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DefaultElementService } from '../../database/default-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class DomainService extends DefaultElementService<Domain, DomainInit> {
  protected readonly typeName = Domain.typeName;

  protected readonly elementConstructor = Domain;

  /**
   * Update a domain.
   *
   * @param id id of the domain
   * @param domain the new values of the object (values will be copied)
   */
  async update(id: string, domain: Partial<Domain>): Promise<void> {
    const dbDomain = await this.get(id);
    dbDomain.update(domain);
    await this.save(dbDomain);
  }
}
