import { Component, QueryList, ViewChildren } from '@angular/core';
import { DevelopmentMethodLoaderService } from '../../shared/development-method-loader.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { IconInit } from '../../../model/icon';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-development-method-general',
  templateUrl: './development-method-general.component.html',
  styleUrls: ['./development-method-general.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: DevelopmentMethodGeneralComponent },
  ],
})
export class DevelopmentMethodGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService
  ) {}

  async updateDevelopmentMethodValue(
    value: Partial<DevelopmentMethod>
  ): Promise<void> {
    if (this.developmentMethod != null) {
      await this.developmentMethodService.update(
        this.developmentMethod._id,
        value
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.developmentMethod != null) {
      await this.developmentMethodService.updateIcon(
        this.developmentMethod._id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get developmentMethod(): DevelopmentMethod | undefined {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
