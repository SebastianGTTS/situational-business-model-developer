import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role, UserService } from '../../role/user.service';
import { NavService } from '../nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() sidenavExpanded!: boolean;
  @Input() sidenavEnabled!: boolean;
  @Output() navbarToggle = new EventEmitter<void>();

  constructor(
    private navService: NavService,
    private router: Router,
    private userService: UserService
  ) {}

  async switchRole(): Promise<void> {
    const navSuccessful = await this.router.navigate(['/']);
    if (navSuccessful) {
      this.userService.role = undefined;
    }
  }

  get currentRole(): Role | undefined {
    return this.userService.role;
  }

  get text(): string | undefined {
    return this.navService.text;
  }
}
