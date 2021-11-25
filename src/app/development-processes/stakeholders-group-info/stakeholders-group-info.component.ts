import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { FormGroup } from '@angular/forms';
import { GroupSelection } from '../../development-process-registry/bm-process/decision';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-stakeholders-group-info',
  templateUrl: './stakeholders-group-info.component.html',
  styleUrls: ['./stakeholders-group-info.component.css'],
})
export class StakeholdersGroupInfoComponent implements OnInit {
  @Input() groups: MultipleSelection<Stakeholder>[][];
  @Input() selection: GroupSelection<Stakeholder>;

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  methodElements: Stakeholder[] = [];

  constructor(private stakeholderService: StakeholderService) {}

  ngOnInit() {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.stakeholderService.getList();
  }
}
