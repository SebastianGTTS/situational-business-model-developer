import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomainService } from '../../../../development-process-registry/knowledge/domain.service';
import { DomainLoaderService } from '../../../shared/domain-loader.service';
import { Domain } from '../../../../development-process-registry/knowledge/domain';
import { IconInit } from 'src/app/model/icon';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css'],
  providers: [
    DomainLoaderService,
    { provide: UPDATABLE, useExisting: DomainComponent },
  ],
})
export class DomainComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private domainLoaderService: DomainLoaderService,
    private domainService: DomainService
  ) {}

  async updateDescription(description: Partial<Domain>): Promise<void> {
    if (this.domain != null) {
      await this.domainService.update(this.domain._id, description);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.domain != null) {
      await this.domainService.updateIcon(this.domain._id, icon);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get domain(): Domain | undefined {
    return this.domainLoaderService.domain;
  }
}
