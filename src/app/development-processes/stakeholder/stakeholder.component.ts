import { Component } from '@angular/core';
import {
  Stakeholder,
  StakeholderInit,
} from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { MethodElementLoaderService } from '../shared/method-element-loader.service';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: StakeholderService },
  ],
})
export class StakeholderComponent {
  constructor(
    private stakeholderLoaderService: MethodElementLoaderService<
      Stakeholder,
      StakeholderInit
    >,
    private stakeholderService: StakeholderService
  ) {}

  async updateValue(value: any): Promise<void> {
    await this.stakeholderService.update(this.stakeholder._id, value);
  }

  get stakeholder(): Stakeholder {
    return this.stakeholderLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.stakeholderLoaderService.listNames;
  }
}
