import { StartComponent } from './start.component';
import { MockComponent } from 'ng-mocks';
import { ProfileComponent } from '../profile/profile.component';
import { StartBusinessDeveloperComponent } from '../start-business-developer/start-business-developer.component';
import { StartMethodEngineerComponent } from '../start-method-engineer/start-method-engineer.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';

describe('StartComponent', function () {
  let spectator: Spectator<StartComponent>;
  const createComponent = createRoutingFactory({
    component: StartComponent,
    declarations: [
      MockComponent(ProfileComponent),
      MockComponent(StartBusinessDeveloperComponent),
      MockComponent(StartMethodEngineerComponent),
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
