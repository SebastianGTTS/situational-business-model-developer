import { Component, QueryList, ViewChildren } from '@angular/core';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodLoaderService } from '../../shared/development-method-loader.service';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-development-method-selection',
  templateUrl: './development-method-selection.component.html',
  styleUrls: ['./development-method-selection.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: DevelopmentMethodSelectionComponent },
  ],
})
export class DevelopmentMethodSelectionComponent implements Updatable {
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

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get developmentMethod(): DevelopmentMethod | undefined {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
