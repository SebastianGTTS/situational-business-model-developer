import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { DomainSelectionFormComponent } from './domain-selection-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Domain,
  DomainEntry,
} from '../../development-process-registry/knowledge/domain';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { byText } from '@ngneat/spectator';

describe('Domain Selection Form Component', () => {
  let spectator: SpectatorHost<DomainSelectionFormComponent>;
  const createHost = createHostFactory({
    component: DomainSelectionFormComponent,
    imports: [ReactiveFormsModule, NgbTypeaheadModule],
  });

  let formControl: FormControl;
  let domainDefinitions: DomainEntry[];

  beforeEach(() => {
    domainDefinitions = [
      new Domain(undefined, {
        name: 'Test Domain',
      }).toDb(),
      new Domain(undefined, {
        name: 'Test Domain 2',
      }).toDb(),
    ];
    formControl = new FormControl();
    spectator = createHost(
      `
    <form [formGroup]="formGroup">
      <app-domain-selection-form
        formGroupName="formControl"
        [domainDefinitions]="domainDefinitions"
        [index]="0"
      ></app-domain-selection-form>
    </form>`,
      {
        hostProps: {
          formGroup: new FormGroup({
            formControl,
          }),
          domainDefinitions,
        },
      }
    );
  });

  it('should be created', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should select real domains', () => {
    let valueChangesCount = 0;
    const subscription = formControl.valueChanges.subscribe(
      () => valueChangesCount++
    );
    const inputField: HTMLInputElement = spectator.query('#domainSelection0');
    spectator.typeInElement('Test', inputField);
    expect(valueChangesCount).toBe(1);
    expect(formControl.value).toBeFalsy();
    spectator.click(byText('Test Domain 2'));
    expect(inputField.value).toBe('Test Domain 2');
    expect(valueChangesCount).toBe(2);
    const value = formControl.value;
    expect(value).toBeTruthy();
    expect(value).toBeInstanceOf(Domain);
    const domain: Domain = value;
    expect(domain.name).toBe('Test Domain 2');
    expect(domain._id).toBe(domainDefinitions[1]._id);
    subscription.unsubscribe();
  });
});
