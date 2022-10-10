import { Component } from '@angular/core';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { DomainLoaderService } from '../shared/domain-loader.service';
import { Domain } from '../../development-process-registry/knowledge/domain';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css'],
  providers: [DomainLoaderService],
})
export class DomainComponent {
  constructor(
    private domainLoaderService: DomainLoaderService,
    private domainService: DomainService
  ) {}

  async updateDescription(description: Partial<Domain>): Promise<void> {
    if (this.domain != null) {
      await this.domainService.update(this.domain._id, description);
    }
  }

  get domain(): Domain | undefined {
    return this.domainLoaderService.domain;
  }
}
