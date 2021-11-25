import { Injectable } from '@angular/core';
import { Domain } from './domain';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DefaultElementService } from '../../database/default-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class DomainService extends DefaultElementService<Domain> {
  protected get typeName(): string {
    return Domain.typeName;
  }

  /**
   * Update a domain.
   *
   * @param id id of the domain
   * @param domain the new values of the object (values will be copied)
   */
  async update(id: string, domain: Partial<Domain>) {
    const dbDomain = await this.get(id);
    dbDomain.update(domain);
    return this.save(dbDomain);
  }

  protected createElement(element: Partial<Domain>): Domain {
    return new Domain(element);
  }
}
