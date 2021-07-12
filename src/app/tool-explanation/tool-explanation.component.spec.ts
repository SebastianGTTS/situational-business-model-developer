import { ToolExplanationComponent } from './tool-explanation.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ToolExplanationComponent', () => {
  let spectator: Spectator<ToolExplanationComponent>;
  const createComponent = createComponentFactory({
    component: ToolExplanationComponent,
    imports: [NgbModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
