import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Artifact,
  ArtifactEntry,
} from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { SelectedElementOptional } from '../../development-process-registry/bm-process/element-decision';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';

@Component({
  selector: 'app-running-process-artifact-add-form',
  templateUrl: './running-process-artifact-add-form.component.html',
  styleUrls: ['./running-process-artifact-add-form.component.css'],
})
export class RunningProcessArtifactAddFormComponent implements OnInit {
  @Input() processArtifacts!: RunningArtifact[];

  @Output() addArtifact = new EventEmitter<{
    artifact: Artifact;
    output: OutputArtifactMapping;
  }>();
  @Output() createArtifact = new EventEmitter<Artifact>();

  form: FormGroup = this.fb.group({
    artifact: this.fb.group({
      list: ['', Validators.required],
      element: [null, Validators.required],
    }),
    data: this.outputArtifactMappingFormService.createOutputArtifactMappingControl(),
  });

  methodElements: ArtifactEntry[] = [];
  listNames: string[] = [];

  constructor(
    private artifactService: ArtifactService,
    private fb: FormBuilder,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService
  ) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  submitForm(): void {
    const output =
      this.outputArtifactMappingFormService.getOutputArtifactMappingControl(
        this.dataFormGroup.value
      );
    const selectedArtifact = this.selectedArtifact;
    if (selectedArtifact != null && output != null) {
      this.addArtifact.emit({
        artifact: selectedArtifact,
        output: output,
      });
    }
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.artifactService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }

  get artifactFormGroup(): FormGroup {
    return this.form.get('artifact') as FormGroup;
  }

  get selectedArtifact(): Artifact | undefined {
    return this.artifactFormGroup.get('element')?.value;
  }

  get artifactOptional(): SelectedElementOptional<Artifact> | undefined {
    if (this.selectedArtifact == null) {
      return undefined;
    }
    return {
      optional: false,
      element: this.selectedArtifact,
    };
  }

  get dataFormGroup(): FormGroup {
    return this.form.get('data') as FormGroup;
  }
}
