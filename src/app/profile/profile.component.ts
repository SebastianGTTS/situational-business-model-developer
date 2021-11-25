import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../database/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(private authService: AuthService) {}

  get username(): string | undefined {
    return this.authService.username;
  }

  get group(): string | undefined {
    return this.authService.group;
  }

  isLocalDatabase(): boolean {
    return environment.localDatabase === true;
  }
}
