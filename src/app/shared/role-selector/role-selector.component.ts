import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Role, UserService } from '../../role/user.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
})
export class RoleSelectorComponent implements OnChanges {
  @Input() defaultRole?: Role;

  @Output() confirm = new EventEmitter<Role>();

  form = this.fb.group({
    role: this.fb.control<Role | null>(null, Validators.required),
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultRole && this.defaultRole != null) {
      this.form.setValue({
        role: this.defaultRole,
      });
    }
  }

  selectRole(): void {
    if (this.selectedRole != null) {
      this.userService.role = this.selectedRole;
      this.confirm.emit(this.selectedRole);
    }
  }

  get roles(): Role[] {
    return this.userService.roles;
  }

  get selectedRole(): Role | undefined {
    return this.form.getRawValue().role ?? undefined;
  }
}
