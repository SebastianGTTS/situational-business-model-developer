import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Stakeholder,
  StakeholderEntry,
} from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { GroupDecision } from '../../development-process-registry/bm-process/group-decision';
import {
  ELEMENT_CONSTRUCTOR,
  GroupDecisionFormService,
} from '../shared/group-decision-form.service';
import { Updatable, UPDATABLE } from '../../shared/updatable';
import { MethodElementGroupInfoComponent } from '../method-element-group-info/method-element-group-info.component';

@Component({
  selector: 'app-stakeholders-group-info',
  templateUrl: './stakeholders-group-info.component.html',
  styleUrls: ['./stakeholders-group-info.component.css'],
  providers: [
    GroupDecisionFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Stakeholder },
    { provide: UPDATABLE, useExisting: StakeholdersGroupInfoComponent },
  ],
})
export class StakeholdersGroupInfoComponent implements OnInit, Updatable {
  @Input() groupDecision!: GroupDecision<Stakeholder>;

  @Output() submitGroupsForm = new EventEmitter<GroupDecision<Stakeholder>>();

  methodElements: StakeholderEntry[] = [];

  @ViewChild(MethodElementGroupInfoComponent)
  methodElementGroupInfoComponent!: Updatable;

  constructor(private stakeholderService: StakeholderService) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.stakeholderService.getList();
  }

  update(): void {
    this.methodElementGroupInfoComponent.update();
  }
}
