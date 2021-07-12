import { MethodElementListComponent } from './method-element-list.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('MethodElementListComponent', () => {
  let spectator: Spectator<MethodElementListComponent>;
  const createComponent = createComponentFactory({
    component: MethodElementListComponent,
    declarations: [],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
