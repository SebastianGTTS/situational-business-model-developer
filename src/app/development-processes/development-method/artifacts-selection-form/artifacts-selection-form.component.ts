import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Artifact,
  ArtifactEntry,
} from '../../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../../development-process-registry/method-elements/artifact/artifact.service';
import { ArtifactMappingFormService } from '../../shared/artifact-mapping-form.service';
import { Groups } from '../../../development-process-registry/development-method/groups';
import {
  ELEMENT_CONSTRUCTOR,
  GroupsFormService,
} from '../../shared/groups-form.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { GroupsFormComponent } from '../groups-form/groups-form.component';

@Component({
  selector: 'app-artifacts-selection-form',
  templateUrl: './artifacts-selection-form.component.html',
  styleUrls: ['./artifacts-selection-form.component.css'],
  providers: [
    GroupsFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Artifact },
    {
      provide: UPDATABLE,
      useExisting: ArtifactsSelectionFormComponent,
    },
  ],
})
export class ArtifactsSelectionFormComponent implements OnInit, Updatable {
  @Input() idPrefix?: string;
  @Input() artifacts!: Groups<Artifact>;

  @Output() submitArtifactsForm = new EventEmitter<Groups<Artifact>>();

  methodElements: ArtifactEntry[] = [];
  listNames: string[] = [];

  @ViewChild(GroupsFormComponent) groupsFormComponent!: Updatable;

  constructor(
    private artifactMappingFormService: ArtifactMappingFormService,
    private artifactService: ArtifactService
  ) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  update(): void {
    this.groupsFormComponent.update();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.artifactService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }
}
