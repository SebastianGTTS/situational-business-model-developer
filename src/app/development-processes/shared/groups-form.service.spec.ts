import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ELEMENT_CONSTRUCTOR, GroupsFormService } from './groups-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Groups } from '../../development-process-registry/development-method/groups';

describe('Artifact Service', () => {
  let spectator: SpectatorService<GroupsFormService<Stakeholder>>;

  const createService = createServiceFactory({
    service: GroupsFormService,
    imports: [ReactiveFormsModule],
    providers: [{ provide: ELEMENT_CONSTRUCTOR, useValue: Stakeholder }],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should deactivate element if multiple is selected', () => {
    spectator.service.loadForm(
      new Groups<Stakeholder>(
        undefined,
        {
          allowNone: false,
          groups: [
            {
              items: [
                {
                  list: 'Company',
                  multiple: true,
                },
              ],
            },
          ],
        },
        Stakeholder
      )
    );
    const items = spectator.service.getItemsFormArray(
      spectator.service.groupsControl.at(0) as FormGroup
    );
    const stakeholderItemControl = spectator.service.getElementControl(
      items.at(0) as FormGroup
    );
    expect(stakeholderItemControl.value).toBeFalsy();
    expect(stakeholderItemControl.disabled).toBe(true);
    expect(items.at(0).get('optional')?.value).toBe(false);
    expect(items.at(0).get('optional')?.disabled).toBe(false);
  });

  it('should not deactivate element if optional is selected', () => {
    spectator.service.loadForm(
      new Groups<Stakeholder>(
        undefined,
        {
          allowNone: false,
          groups: [
            {
              items: [
                {
                  list: 'Company',
                  element: { list: 'Company', name: 'Business Developer' },
                  optional: true,
                },
              ],
            },
          ],
        },
        Stakeholder
      )
    );
    const items = spectator.service.getItemsFormArray(
      spectator.service.groupsControl.at(0) as FormGroup
    );
    const stakeholderItemControl = spectator.service.getElementControl(
      items.at(0) as FormGroup
    );
    expect(stakeholderItemControl.value).toBeTruthy();
    expect(stakeholderItemControl.enabled).toBe(true);
  });
});
