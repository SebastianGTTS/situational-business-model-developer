import { NavbarComponent } from './navbar.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('NavbarComponent', () => {
  let spectator: Spectator<NavbarComponent>;
  const createComponent = createComponentFactory({
    component: NavbarComponent,
    declarations: [],
    imports: [ReactiveFormsModule, RouterTestingModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
