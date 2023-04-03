import { Component, QueryList, ViewChildren } from '@angular/core';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { Domain } from '../../../../../development-process-registry/knowledge/domain';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { Author } from '../../../../../model/author';
import { UPDATABLE, Updatable } from '../../../../../shared/updatable';
import { IconInit } from '../../../../../model/icon';

@Component({
  selector: 'app-expert-model-general',
  templateUrl: './expert-model-general.component.html',
  styleUrls: ['./expert-model-general.component.scss'],
  providers: [{ provide: UPDATABLE, useExisting: ExpertModelGeneralComponent }],
})
export class ExpertModelGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private expertModelService: ExpertModelService
  ) {}

  async updateExpertModel(description: Partial<ExpertModel>): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.update(this.expertModel._id, description);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.updateIcon(this.expertModel._id, icon);
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.updateDomains(
        this.expertModel._id,
        domains
      );
    }
  }

  async updateFeatureModelAuthor(authorInfo: Partial<Author>): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.updateAuthor(
        this.expertModel._id,
        authorInfo
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
