import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  Stakeholder,
  StakeholderInit,
} from '../../../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { MethodElementLoaderService } from '../../../shared/method-element-loader.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { IconInit } from 'src/app/model/icon';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: StakeholderService },
    { provide: UPDATABLE, useExisting: StakeholderComponent },
  ],
})
export class StakeholderComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private stakeholderLoaderService: MethodElementLoaderService<
      Stakeholder,
      StakeholderInit
    >,
    private stakeholderService: StakeholderService
  ) {}

  async updateValue(value: StakeholderInit): Promise<void> {
    if (this.stakeholder != null) {
      await this.stakeholderService.update(this.stakeholder._id, value);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.stakeholder != null) {
      await this.stakeholderService.updateIcon(this.stakeholder._id, icon);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get stakeholder(): Stakeholder | undefined {
    return this.stakeholderLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.stakeholderLoaderService.listNames;
  }
}
