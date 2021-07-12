import { BmProcessDiagramComponent } from './bm-process-diagram.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';

describe('BmProcessDiagramComponent', () => {
  let spectator: Spectator<BmProcessDiagramComponent>;
  const createComponent = createComponentFactory({
    component: BmProcessDiagramComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
    mocks: [DevelopmentMethodService, ProcessPatternService],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
