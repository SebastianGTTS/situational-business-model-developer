import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Artifact,
  ArtifactEntry,
} from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { FormGroup } from '@angular/forms';
import { GroupSelection } from '../../development-process-registry/bm-process/decision';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-artifacts-group-info',
  templateUrl: './artifacts-group-info.component.html',
  styleUrls: ['./artifacts-group-info.component.css'],
})
export class ArtifactsGroupInfoComponent implements OnInit {
  @Input() groups: MultipleSelection<Artifact>[][];
  @Input() selection: GroupSelection<Artifact>;

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  methodElements: ArtifactEntry[] = [];

  constructor(private artifactService: ArtifactService) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.artifactService.getList();
  }
}
