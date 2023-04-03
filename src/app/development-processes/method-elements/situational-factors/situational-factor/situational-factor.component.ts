import { Component, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SituationalFactorService } from '../../../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit,
} from '../../../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { MethodElementLoaderService } from '../../../shared/method-element-loader.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { IconInit } from 'src/app/model/icon';
import { UPDATABLE, Updatable } from 'src/app/shared/updatable';

@Component({
  selector: 'app-situational-factor',
  templateUrl: './situational-factor.component.html',
  styleUrls: ['./situational-factor.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: SituationalFactorService },
    { provide: UPDATABLE, useExisting: SituationalFactorComponent },
  ],
})
export class SituationalFactorComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private situationalFactorLoaderService: MethodElementLoaderService<
      SituationalFactorDefinition,
      SituationalFactorDefinitionInit
    >,
    private situationalFactorService: SituationalFactorService
  ) {}

  async updateSituationalFactor(form: UntypedFormGroup): Promise<void> {
    await this.updateSituationalFactorValue(form.value);
  }

  async updateSituationalFactorValue(
    value: SituationalFactorDefinitionInit
  ): Promise<void> {
    if (this.situationalFactor != null) {
      await this.situationalFactorService.update(
        this.situationalFactor._id,
        value
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.situationalFactor != null) {
      await this.situationalFactorService.updateIcon(
        this.situationalFactor._id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get situationalFactor(): SituationalFactorDefinition | undefined {
    return this.situationalFactorLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.situationalFactorLoaderService.listNames;
  }
}
