import { Component } from '@angular/core';
import { InternalRoles, UserService } from '../user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent {
  constructor(private userService: UserService) {}

  get currentRole(): InternalRoles {
    return this.userService.activatedRole;
  }

  get roles(): typeof InternalRoles {
    return InternalRoles;
  }

  isLocalDatabase(): boolean {
    return environment.localDatabase === true;
  }
}
