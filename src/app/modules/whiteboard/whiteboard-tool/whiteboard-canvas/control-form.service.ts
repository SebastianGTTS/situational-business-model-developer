import { Injectable, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export enum Controls {
  VIEW,
  MOVE,
  DRAWING,
  TEXT,
  NOTE,
  RECT,
  IMAGE,
}

@Injectable()
export class ControlFormService implements OnDestroy {
  controlsForm: UntypedFormGroup = this.fb.group({
    control: this.fb.control(Controls.VIEW, Validators.required),
    colorMenu: this.fb.control(false, Validators.required),
    fontMenu: this.fb.control(false, Validators.required),
    propertiesMenu: this.fb.control(false, Validators.required),
  });

  private controlChangeSubscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder) {
    this.init();
  }

  private init(): void {
    this.controlChangeSubscriptions.push(
      this.colorMenuControl.valueChanges
        .pipe(
          filter((value) => value),
          tap(() => {
            this.fontMenuControl.setValue(false);
            this.propertiesMenuControl.setValue(false);
          })
        )
        .subscribe()
    );
    this.controlChangeSubscriptions.push(
      this.fontMenuControl.valueChanges
        .pipe(
          filter((value) => value),
          tap(() => {
            this.colorMenuControl.setValue(false);
            this.propertiesMenuControl.setValue(false);
          })
        )
        .subscribe()
    );
    this.controlChangeSubscriptions.push(
      this.propertiesMenuControl.valueChanges
        .pipe(
          filter((value) => value),
          tap(() => {
            this.colorMenuControl.setValue(false);
            this.fontMenuControl.setValue(false);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.controlChangeSubscriptions) {
      subscription.unsubscribe();
    }
  }

  get controlControl(): UntypedFormControl {
    return this.controlsForm.get('control') as UntypedFormControl;
  }

  get controlValue(): Controls {
    return this.controlControl.value;
  }

  private get colorMenuControl(): UntypedFormControl {
    return this.controlsForm.get('colorMenu') as UntypedFormControl;
  }

  get colorMenuShown(): boolean {
    return this.colorMenuControl.value;
  }

  private get fontMenuControl(): UntypedFormControl {
    return this.controlsForm.get('fontMenu') as UntypedFormControl;
  }

  get fontMenuShown(): boolean {
    return this.fontMenuControl.value;
  }

  private get propertiesMenuControl(): UntypedFormControl {
    return this.controlsForm.get('propertiesMenu') as UntypedFormControl;
  }

  get propertiesMenuShown(): boolean {
    return this.propertiesMenuControl.value;
  }
}
