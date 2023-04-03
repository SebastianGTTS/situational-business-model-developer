import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './database/auth.service';
import { version } from '../environments/app.version';
import { Router } from '@angular/router';
import { SbmdViewportScroller } from './sbmd-viewport-scroller';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SIDENAV_CONTROL, SidenavControl } from './sidenav-control';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: SIDENAV_CONTROL,
      useExisting: AppComponent,
    },
  ],
  animations: [
    trigger('sidenav', [
      transition('* => false', [
        query(
          'aside:leave',
          [animate('0.2s ease-in', style({ transform: 'translateX(-100%)' }))],
          { optional: true }
        ),
      ]),
      transition('* => true', [
        query(
          'aside:enter',
          [style({ transform: 'translateX(-100%)' }), animate('0.2s ease-out')],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, SidenavControl {
  VERSION = version;

  private sidenavToggled = true;

  @ViewChild('content', { static: true }) content!: ElementRef<HTMLDivElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sbmdViewportScroller: SbmdViewportScroller
  ) {}

  ngOnInit(): void {
    this.sbmdViewportScroller.setElement(this.content.nativeElement);
  }

  toggleSidenav(): void {
    if (this.sidenavEnabled) {
      this.sidenavToggled = !this.sidenavToggled;
    }
  }

  get showNavbar(): boolean {
    return this.authService.isLoggedIn();
  }

  get showSidenav(): boolean {
    return this.sidenavEnabled && this.sidenavToggled;
  }

  isSidenavShown(): boolean {
    return this.showSidenav;
  }

  get sidenavEnabled(): boolean {
    return this.authService.isLoggedIn();
  }
}
