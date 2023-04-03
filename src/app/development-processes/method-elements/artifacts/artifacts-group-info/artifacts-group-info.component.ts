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
} from '../../../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../../../development-process-registry/method-elements/artifact/artifact.service';
import { GroupDecision } from '../../../../development-process-registry/bm-process/group-decision';
import {
  ELEMENT_CONSTRUCTOR,
  GroupDecisionFormService,
} from '../../../shared/group-decision-form.service';
import { MethodElementGroupInfoComponent } from '../../method-element-group-info/method-element-group-info.component';
import { UPDATABLE, Updatable } from '../../../../shared/updatable';

@Component({
  selector: 'app-artifacts-group-info',
  templateUrl: './artifacts-group-info.component.html',
  styleUrls: ['./artifacts-group-info.component.css'],
  providers: [
    GroupDecisionFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Artifact },
    { provide: UPDATABLE, useExisting: ArtifactsGroupInfoComponent },
  ],
})
export class ArtifactsGroupInfoComponent implements OnInit, Updatable {
  @Input() groupDecision!: GroupDecision<Artifact>;

  @Output() submitGroupsForm = new EventEmitter<GroupDecision<Artifact>>();

  methodElements: ArtifactEntry[] = [];

  @ViewChild(MethodElementGroupInfoComponent)
  methodElementGroupInfoComponent!: Updatable;

  constructor(private artifactService: ArtifactService) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.artifactService.getList();
  }

  update(): void {
    this.methodElementGroupInfoComponent.update();
  }
}
