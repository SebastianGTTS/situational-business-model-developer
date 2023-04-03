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
} from '../../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { Groups } from '../../../development-process-registry/development-method/groups';
import {
  ELEMENT_CONSTRUCTOR,
  GroupsFormService,
} from '../../shared/groups-form.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { GroupsFormComponent } from '../groups-form/groups-form.component';

@Component({
  selector: 'app-stakeholders-selection-form',
  templateUrl: './stakeholders-selection-form.component.html',
  styleUrls: ['./stakeholders-selection-form.component.css'],
  providers: [
    GroupsFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Stakeholder },
    {
      provide: UPDATABLE,
      useExisting: StakeholdersSelectionFormComponent,
    },
  ],
})
export class StakeholdersSelectionFormComponent implements OnInit, Updatable {
  @Input() stakeholders!: Groups<Stakeholder>;

  @Output() submitStakeholdersForm = new EventEmitter<Groups<Stakeholder>>();

  methodElements: StakeholderEntry[] = [];
  listNames: string[] = [];

  @ViewChild(GroupsFormComponent) groupsFormComponent!: Updatable;

  constructor(private stakeholderService: StakeholderService) {}

  ngOnInit(): void {
    void this.loadStakeholders();
  }

  update(): void {
    this.groupsFormComponent.update();
  }

  private async loadStakeholders(): Promise<void> {
    this.methodElements = await this.stakeholderService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }
}
