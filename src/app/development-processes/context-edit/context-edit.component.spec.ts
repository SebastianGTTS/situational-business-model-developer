import { ContextEditComponent } from './context-edit.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { DomainsSelectionFormComponent } from '../../shared/domains-selection-form/domains-selection-form.component';
import { SituationalFactorsSelectionFormComponent } from '../situational-factors-selection-form/situational-factors-selection-form.component';
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

  it('should show finish button', () => {
    let finished = false;
    const subscription = spectator
      .output('finishInitialization')
      .subscribe(() => (finished = true));
    spectator.setInput('finishAllowed', true);
    const finishButton =
      spectator.query(
        byText('Finish definition of the context', { selector: 'button' })
      ) ?? undefined;
    expect(finishButton).toBeTruthy();
    expect(finished).toBe(false);
    spectator.click(finishButton);
    expect(finished).toBe(true);
    subscription.unsubscribe();
  });
});
