import { Component, QueryList, ViewChildren } from '@angular/core';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';
import { Instance, InstanceType } from '../../../canvas-meta-artifact/instance';
import { FormControl, FormGroup } from '@angular/forms';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { IconInit } from '../../../../../model/icon';
import { UPDATABLE, Updatable } from '../../../../../shared/updatable';

@Component({
  selector: 'app-instance-general',
  templateUrl: './instance-general.component.html',
  styleUrls: ['./instance-general.component.scss'],
  providers: [{ provide: UPDATABLE, useExisting: InstanceGeneralComponent }],
})
export class InstanceGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private expertModelService: ExpertModelService,
    private instanceLoaderService: InstanceLoaderService
  ) {}

  async updateInstance(
    formGroup: FormGroup<{
      name: FormControl<string>;
      description: FormControl<string>;
    }>
  ): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      const formValue = formGroup.getRawValue();
      await this.expertModelService.updateInstanceInfo(
        this.expertModel._id,
        this.instance.id,
        formValue.name,
        formValue.description
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.updateInstanceIcon(
        this.expertModel._id,
        this.instance.id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get instanceTypeName(): string | undefined {
    if (this.instance != null) {
      switch (this.instance.type) {
        case InstanceType.EXAMPLE:
          return 'Example';
        case InstanceType.PATTERN:
          return 'Pattern';
      }
    }
    return undefined;
  }

  get expertModel(): ExpertModel | undefined {
    return this.instanceLoaderService.expertModel;
  }
}
