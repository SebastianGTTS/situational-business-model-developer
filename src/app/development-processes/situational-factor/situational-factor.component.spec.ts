import { SituationalFactorComponent } from './situational-factor.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { FormArrayListComponent } from '../../shared/form-array-list/form-array-list.component';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import {
  SituationalFactorDefinition
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';

describe('SituationalFactorComponent', () => {
  let spectator: Spectator<SituationalFactorComponent>;
  const createComponent = createRoutingFactory({
    component: SituationalFactorComponent,
    declarations: [
      MockComponent(FormArrayListComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [SituationalFactorService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(SituationalFactorService).getSituationalFactor.and.returnValue(Promise.resolve(new SituationalFactorDefinition({})));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
