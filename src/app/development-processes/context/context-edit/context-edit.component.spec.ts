import { ContextEditComponent } from './context-edit.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { DomainsSelectionFormComponent } from '../../../shared/domains-selection-form/domains-selection-form.component';
import { SituationalFactorsSelectionFormComponent } from '../../development-method/situational-factors-selection-form/situational-factors-selection-form.component';
import { MockComponent } from 'ng-mocks';
import { byText } from '@ngneat/spectator';

describe('ContextEditComponent', () => {
  let spectator: Spectator<ContextEditComponent>;
  const createComponent = createRoutingFactory({
    component: ContextEditComponent,
    declarations: [
      MockComponent(DomainsSelectionFormComponent),
      MockComponent(SituationalFactorsSelectionFormComponent),
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not show finish button', () => {
    expect(
      spectator.query(
        byText('Finish definition of the context', { selector: 'button' })
      )
    ).toBeFalsy();
  });
});
