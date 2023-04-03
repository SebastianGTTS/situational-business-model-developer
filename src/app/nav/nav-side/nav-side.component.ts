import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuNavItem } from '../../development-process-registry/module-api/nav-item';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NavService } from '../nav.service';
import { Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../database/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../role/user.service';

@Component({
  selector: 'app-nav-side',
  templateUrl: './nav-side.component.html',
  styleUrls: ['./nav-side.component.css'],
  animations: [
    trigger('heading', [
      transition(':increment', [
        query(':enter', [
          style({
            height: 0,
            width: 0,
            visibility: 'hidden',
          }),
        ]),
        query('.sbmd-animate', [
          animate('0.2s ease-in', style({ opacity: 0 })),
          style({ transform: 'translateX(100%)' }),
        ]),
        query(':leave', [
          style({
            height: 0,
            width: 0,
            visibility: 'hidden',
          }),
        ]),
        query(':enter', [
          style({
            height: '*',
            width: '*',
            visibility: '*',
          }),
        ]),
        query('.sbmd-animate', [
          style({ opacity: '*' }),
          animate('0.1s ease-out', style({ transform: 'translateX(0)' })),
        ]),
      ]),
      transition(':decrement', [
        query(':enter', [
          style({
            height: 0,
            width: 0,
            visibility: 'hidden',
          }),
        ]),
        query('.sbmd-animate', [
          animate('0.1s ease-in', style({ transform: 'translateX(100%)' })),
        ]),
        query(':leave', [
          style({
            height: 0,
            width: 0,
            visibility: 'hidden',
          }),
        ]),
        query('.sbmd-animate', [
          style({ transform: 'translateX(0)', opacity: 0 }),
        ]),
        query(':enter', [
          style({
            height: '*',
            width: '*',
            visibility: '*',
          }),
        ]),
        query('.sbmd-animate', [
          animate('0.2s ease-out', style({ opacity: 1 })),
        ]),
      ]),
    ]),
  ],
})
export class NavSideComponent implements OnInit, OnDestroy {
  @ViewChild('navigation', { static: true })
  navigation!: ElementRef<HTMLDivElement>;

  expandAll = false;

  private navChangeSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private navService: NavService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.navChangeSubscription = this.navService.navChanged.subscribe(() => {
      this.checkLength();
    });
  }

  ngOnDestroy(): void {
    this.navChangeSubscription?.unsubscribe();
  }

  get currentNavMenu(): MenuNavItem {
    return this.navService.currentNavMenu;
  }

  get hasLink(): boolean {
    return this.navService.menuLink != null;
  }

  get link(): string[] | undefined {
    return this.navService.menuLink;
  }

  get queryParams(): Params | undefined {
    return this.navService.menuLinkQueryParams;
  }

  get depth(): number {
    return this.navService.depth;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  isLocalDatabase(): boolean {
    return environment.localDatabase;
  }

  private checkLength(): void {
    const role = this.userService.activatedRole;
    if (role == null) {
      this.expandAll = false;
      return;
    }
    const neededHeight = this.navService.getNumberOfItems(role) * 40;
    const currentHeight =
      this.navigation.nativeElement.clientHeight - 2 * 16 - 30 - 2 * 16 - 38;
    this.expandAll = neededHeight <= currentHeight;
  }
}
