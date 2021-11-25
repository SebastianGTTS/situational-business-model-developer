import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { SEARCH_FUNCTION } from '../../shared/search.service';

@Component({
  selector: 'app-running-process-artifact-import-form',
  templateUrl: './running-process-artifact-import-form.component.html',
  styleUrls: ['./running-process-artifact-import-form.component.css'],
  providers: [
    {
      provide: SEARCH_FUNCTION,
      useValue: (searchValue: string, item: RunningArtifact) =>
        item.identifier.toLowerCase().includes(searchValue),
    },
  ],
})
export class RunningProcessArtifactImportFormComponent implements OnInit {
  artifacts: RunningArtifact[];

  @Output() selectArtifact = new EventEmitter<RunningArtifact>();

  constructor(private concreteArtifactService: ConcreteArtifactService) {}

  ngOnInit(): void {
    void this.loadArtifacts();
  }

  async loadArtifacts(): Promise<void> {
    this.artifacts = await this.concreteArtifactService.getList();
  }
}
