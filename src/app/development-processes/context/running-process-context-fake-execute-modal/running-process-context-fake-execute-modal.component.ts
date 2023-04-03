import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SelectedElementOptional } from '../../../development-process-registry/bm-process/element-decision';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';
import {
  OutputMapping,
  RunningProcessContextFakeExecuteModal,
} from './running-process-context-fake-execute-modal';

@Component({
  selector: 'app-running-process-context-fake-execute-modal',
  templateUrl: './running-process-context-fake-execute-modal.component.html',
  styleUrls: ['./running-process-context-fake-execute-modal.component.css'],
})
export class RunningProcessContextFakeExecuteModalComponent
  implements RunningProcessContextFakeExecuteModal, OnChanges
{
  @Input() artifacts!: RunningArtifact[];
  @Input() methodDecision!: MethodDecision;

  @Output() addFakeExecution = new EventEmitter<OutputMapping>();

  form: UntypedFormGroup = this.fb.group({
    outputArtifacts: this.fb.array([]),
  });

  outputArtifacts: SelectedElementOptional<Artifact>[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.methodDecision) {
      const methodDecision: MethodDecision =
        changes.methodDecision.currentValue;
      this.outputArtifacts =
        methodDecision.outputArtifacts.getSelectedElementsOptional();
      this.loadForm(this.outputArtifacts);
    }
  }

  onAllInputsSet(): void {
    this.outputArtifacts =
      this.methodDecision.outputArtifacts.getSelectedElementsOptional();
    this.loadForm(this.outputArtifacts);
  }

  loadForm(artifacts: SelectedElementOptional<Artifact>[]): void {
    const formGroups = artifacts.map((selectedElement) =>
      this.fb.group(
        {
          artifact: this.fb.control(
            null,
            selectedElement.optional ? undefined : Validators.required
          ),
          version: this.fb.control(
            null,
            selectedElement.optional ? undefined : Validators.required
          ),
        },
        {
          validators: (control: UntypedFormGroup): ValidationErrors | null => {
            if (
              control.get('artifact')?.value != null &&
              control.get('version')?.value == null
            ) {
              return { versionNotSelected: true };
            }
            return null;
          },
        }
      )
    );
    this.form.setControl('outputArtifacts', this.fb.array(formGroups));
  }

  submitForm(): void {
    this.addFakeExecution.emit(this.formArray.value);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  getArtifactIndex(index: number): number | undefined {
    return this.formArray.at(index).get('artifact')?.value;
  }

  getArtifact(index: number): RunningArtifact {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.artifacts[this.getArtifactIndex(index)!];
  }

  get formArray(): UntypedFormArray {
    return this.form.get('outputArtifacts') as UntypedFormArray;
  }
}
