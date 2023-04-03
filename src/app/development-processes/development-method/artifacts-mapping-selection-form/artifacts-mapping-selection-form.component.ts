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
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { ArtifactService } from '../../../development-process-registry/method-elements/artifact/artifact.service';
import { ArtifactGroups } from '../../../development-process-registry/development-method/artifact-groups';
import { ArtifactsMappingFormService } from './artifacts-mapping-form.service';
import { GroupsFormService } from '../../shared/groups-form.service';
import { Groups } from '../../../development-process-registry/development-method/groups';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { GroupsFormComponent } from '../groups-form/groups-form.component';

@Component({
  selector: 'app-artifacts-mapping-selection-form',
  templateUrl: './artifacts-mapping-selection-form.component.html',
  styleUrls: ['./artifacts-mapping-selection-form.component.css'],
  providers: [
    { provide: GroupsFormService, useClass: ArtifactsMappingFormService },
    {
      provide: UPDATABLE,
      useExisting: ArtifactsMappingSelectionFormComponent,
    },
  ],
})
export class ArtifactsMappingSelectionFormComponent
  implements OnInit, Updatable
{
  @Input() idPrefix?: string;
  @Input() artifacts!: ArtifactGroups;
  @Input() developmentMethod!: DevelopmentMethod;

  @Output() submitArtifactsForm = new EventEmitter<ArtifactGroups>();

  methodElements: ArtifactEntry[] = [];
  listNames: string[] = [];

  @ViewChild(GroupsFormComponent) groupsFormComponent!: Updatable;

  constructor(private artifactService: ArtifactService) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  submitForm(artifactGroups: Groups<Artifact>): void {
    this.submitArtifactsForm.emit(artifactGroups as ArtifactGroups);
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
