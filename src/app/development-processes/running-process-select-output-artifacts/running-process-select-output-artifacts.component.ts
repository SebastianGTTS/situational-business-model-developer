import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  OutputArtifactMappingFormService,
  OutputArtifactMappingFormValue,
} from '../shared/output-artifact-mapping-form.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';
import { equalsListGeneric } from '../../shared/utils';
import { ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';
import { StepArtifact } from '../../development-process-registry/running-process/step-artifact';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { SelectedElementOptional } from '../../development-process-registry/bm-process/element-decision';

@Component({
  selector: 'app-running-process-select-output-artifacts',
  templateUrl: './running-process-select-output-artifacts.component.html',
  styleUrls: ['./running-process-select-output-artifacts.component.css'],
})
export class RunningProcessSelectOutputArtifactsComponent
  implements OnChanges, OnDestroy
{
  @Input() runningProcess!: RunningProcess;
  @Input() runningMethod!: RunningMethod;
  @Input() decision!: MethodDecision;

  @Output() updateOutputArtifacts = new EventEmitter<FormArray>();

  outputArtifacts: SelectedElementOptional<Artifact>[] = [];
  internalOutputArtifacts: (StepArtifact | undefined)[] = [];

  form!: FormGroup;
  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    let reload = false;
    if (changes.runningMethod) {
      const oldRunningMethod: RunningMethod =
        changes.runningMethod.previousValue;
      const newRunningMethod: RunningMethod =
        changes.runningMethod.currentValue;
      if (
        oldRunningMethod == null ||
        !this.equals(
          oldRunningMethod.outputArtifacts,
          newRunningMethod.outputArtifacts
        )
      ) {
        reload = true;
      }
    }
    if (changes.decision || reload) {
      const decision: MethodDecision = changes.decision.currentValue;
      this.outputArtifacts =
        decision.outputArtifacts.getSelectedElementsOptional();
      this.internalOutputArtifacts = this.runningMethod.getOutputArtifacts();
      this.loadForm(this.outputArtifacts, this.runningMethod.outputArtifacts);
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
      this.changeSubscription = undefined;
    }
  }

  loadForm(
    artifacts: SelectedElementOptional<Artifact>[],
    outputArtifacts: (OutputArtifactMapping | undefined)[] | undefined
  ): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
      this.changeSubscription = undefined;
    }
    this.form = this.outputArtifactMappingFormService.createForm(
      artifacts,
      outputArtifacts
    );
    this.changed = outputArtifacts == null;
    this.changeSubscription = this.formArray.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value: OutputArtifactMappingFormValue[]) =>
            (this.changed = !this.equals(
              this.outputArtifactMappingFormService.get(value),
              this.runningMethod.outputArtifacts
            ))
        )
      )
      .subscribe();
  }

  submitForm(): void {
    this.updateOutputArtifacts.emit(this.formArray);
  }

  get formArray(): FormArray {
    return this.form.get('outputArtifacts') as FormArray;
  }

  showNotes(artifact: Artifact, index: number): boolean {
    if (artifact.internalArtifact) {
      return false;
    }
    const formValue: OutputArtifactMappingFormValue =
      this.formArray.at(index).value;
    if (formValue.isDefinition) {
      return true;
    }
    return formValue.artifact != null;
  }

  private equals(
    outputArtifactsA: (OutputArtifactMapping | undefined)[] | undefined,
    outputArtifactsB: (OutputArtifactMapping | undefined)[] | undefined
  ): boolean {
    return equalsListGeneric(
      outputArtifactsA,
      outputArtifactsB,
      (mappingA, mappingB): boolean => {
        if (mappingA == null && mappingB == null) {
          return true;
        }
        if (mappingA == null || mappingB == null) {
          return false;
        }
        if (
          mappingA.isDefinition !== mappingB.isDefinition ||
          mappingA.data.type !== mappingB.data.type
        ) {
          return false;
        }
        if (mappingA.isDefinition) {
          if (mappingA.artifactName !== mappingB.artifactName) {
            return false;
          }
        } else {
          if (mappingA.artifact !== mappingB.artifact) {
            return false;
          }
        }
        if (mappingA.data.type === ArtifactDataType.STRING) {
          return mappingA.data.data === mappingB.data.data;
        }
        return true;
      }
    );
  }
}
