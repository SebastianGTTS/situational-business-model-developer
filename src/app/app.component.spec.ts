import { AppComponent } from './app.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { NavbarComponent } from './navbar/navbar.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    declarations: [
      MockComponent(NavbarComponent),
    ],
    imports: [RouterTestingModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create the app', () => {
    expect(spectator.debugElement.componentInstance).toBeTruthy();
  });
});
