import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-bm-phase-process-board-number-form',
  templateUrl: './bm-phase-process-board-number-form.component.html',
  styleUrls: ['./bm-phase-process-board-number-form.component.css'],
})
export class BmPhaseProcessBoardNumberFormComponent
  implements AfterViewInit, OnChanges
{
  @Input() number?: number;

  @Output() submitNumberForm = new EventEmitter<number>();

  form: UntypedFormGroup = this.fb.group({
    number: [undefined, [Validators.required, Validators.min(1)]],
  });

  @ViewChild('numberInput') numberInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: UntypedFormBuilder) {}

  ngAfterViewInit(): void {
    this.numberInput.nativeElement.select();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.number) {
      const oldNumber: number | undefined = changes.number.previousValue;
      const newNumber: number | undefined = changes.number.currentValue;
      if (oldNumber !== newNumber) {
        this.form.setValue({
          number: newNumber ?? undefined,
        });
      }
    }
  }

  submitForm(): void {
    this.submitNumberForm.emit(this.form.value.number);
  }
}
