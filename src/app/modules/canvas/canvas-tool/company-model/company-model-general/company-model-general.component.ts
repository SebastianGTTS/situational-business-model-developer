import { Component, QueryList, ViewChildren } from '@angular/core';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { IconInit } from '../../../../../model/icon';
import { Author } from '../../../../../model/author';
import { Updatable, UPDATABLE } from '../../../../../shared/updatable';

@Component({
  selector: 'app-company-model-general',
  templateUrl: './company-model-general.component.html',
  styleUrls: ['./company-model-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: CompanyModelGeneralComponent },
  ],
})
export class CompanyModelGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private companyModelLoaderService: CompanyModelLoaderService,
    private companyModelService: CompanyModelService
  ) {}

  async updateCompanyModel(description: Partial<CompanyModel>): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.update(this.companyModel._id, description);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.updateIcon(this.companyModel._id, icon);
    }
  }

  async updateFeatureModelAuthor(authorInfo: Partial<Author>): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.updateAuthor(
        this.companyModel._id,
        authorInfo
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
