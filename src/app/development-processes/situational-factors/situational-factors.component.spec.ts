import { SituationalFactorsComponent } from './situational-factors.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';

describe('SituationalFactorsComponent', () => {
  let spectator: Spectator<SituationalFactorsComponent>;
  const createComponent = createRoutingFactory({
    component: SituationalFactorsComponent,
    declarations: [],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [SituationalFactorService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(SituationalFactorService).getSituationalFactors.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
