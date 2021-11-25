import { Component } from '@angular/core';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { DomainLoaderService } from '../shared/domain-loader.service';

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

  async updateDescription(description: any) {
    await this.domainService.update(this.domain._id, description);
  }

  get domain() {
    return this.domainLoaderService.domain;
  }
}
