import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';

@Component({
  selector: 'app-instance-select-pattern-form',
  templateUrl: './instance-select-pattern-form.component.html',
  styleUrls: ['./instance-select-pattern-form.component.css'],
})
export class InstanceSelectPatternFormComponent implements OnChanges {
  @Input() expertModels: ExpertModel[] = [];
  @Input() showsPattern = false;

  @Output() showPattern = new EventEmitter<{
    instance: Instance;
    featureModelId: string;
  }>();
  @Output() clearPattern = new EventEmitter<void>();

  selectPatternForm: FormGroup = this.fb.group({
    featureModel: [null, Validators.required],
    instance: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showsPattern) {
      if (changes.showsPattern.currentValue) {
        this.selectPatternForm.disable();
      } else {
        this.selectPatternForm.enable();
      }
    }
  }

  submit(): void {
    if (this.instance != null && this.expertModel != null) {
      this.showPattern.emit({
        instance: this.instance,
        featureModelId: this.expertModel._id,
      });
    }
  }

  get expertModel(): ExpertModel | undefined {
    return this.featureModelControl.value;
  }

  get instance(): Instance | undefined {
    return this.instanceControl.value;
  }

  get featureModelControl(): FormControl {
    return this.selectPatternForm.get('featureModel') as FormControl;
  }

  get instanceControl(): FormControl {
    return this.selectPatternForm.get('instance') as FormControl;
  }
}
