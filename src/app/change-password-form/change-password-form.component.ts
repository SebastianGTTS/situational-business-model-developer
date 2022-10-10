import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css'],
})
export class ChangePasswordFormComponent {
  @Output() changePassword = new EventEmitter<string>();

  passwordForm: FormGroup = this.fb.group(
    {
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      confirm: this.fb.control(''),
    },
    {
      validators: (group) => {
        if (group.get('password')?.value !== group.get('confirm')?.value) {
          return { passwordNotConfirmed: true };
        }
        return null;
      },
    }
  );

  constructor(private fb: FormBuilder) {}

  submitForm(): void {
    this.changePassword.emit(this.passwordControl.value);
    this.passwordForm.reset();
  }

  get passwordControl(): FormControl {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirmControl(): FormControl {
    return this.passwordForm.get('confirm') as FormControl;
  }
}
