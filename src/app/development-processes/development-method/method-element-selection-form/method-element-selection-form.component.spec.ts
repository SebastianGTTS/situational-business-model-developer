import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { MethodElementSelectionFormComponent } from './method-element-selection-form.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Stakeholder,
  StakeholderEntry,
} from '../../../development-process-registry/method-elements/stakeholder/stakeholder';
import { byText } from '@ngneat/spectator';

describe('MethodElementSelectionFormComponent', () => {
  let spectator: SpectatorHost<MethodElementSelectionFormComponent>;
  const createHost = createHostFactory({
    component: MethodElementSelectionFormComponent,
    imports: [NgbTypeaheadModule, ReactiveFormsModule],
  });

  let formGroup: FormGroup;
  let stakeholders: StakeholderEntry[];

  beforeEach(() => {
    stakeholders = [
      new Stakeholder(undefined, {
        list: 'Company',
        name: 'Business Developer',
      }).toDb(),
      new Stakeholder(undefined, {
        list: 'Company',
        name: 'Software Developer',
      }).toDb(),
    ];
    formGroup = new FormGroup({
      list: new FormControl('', Validators.required),
      element: new FormControl(null),
      multiple: new FormControl(false),
      optional: new FormControl(false),
    });
    spectator = createHost(
      `
      <app-method-element-selection-form
        methodElementName='Test Element'
        [multipleAllowed]='true'
        [formGroup]='formGroup'
        [listNames]='listNames'
        [methodElements]='stakeholders'
      ></app-method-element-selection-form>
      `,
      {
        hostProps: {
          formGroup,
          listNames: Array.from(
            new Set(...stakeholders.map((entry) => entry.list))
          ),
          stakeholders,
        },
      }
    );
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should automatically set the correct list value', () => {
    const listField = spectator.query(
      '#listInput-' + spectator.component.id
    ) as HTMLInputElement;
    const inputField = spectator.query(
      '#elementInput-' + spectator.component.id
    ) as HTMLInputElement;
    spectator.typeInElement('Business', inputField);
    spectator.click(byText('Business Developer'));
    expect(inputField.value).toBe('Business Developer');
    expect(listField.value).toBe('Company');
    expect(formGroup.get('list')?.value).toBe('Company');
    expect(formGroup.get('element')?.value).toBe(stakeholders[0]);
  });

  it('should disable element control if specifiying multiple', () => {
    const stakeholder = stakeholders[0];
    formGroup.get('element')?.setValue(stakeholder);
    formGroup.get('optional')?.setValue(true);
    const multipleButton = spectator.query(
      byText('Multiple')
    ) as HTMLInputElement;
    expect(formGroup.get('multiple')?.value).toBe(false);
    spectator.click(multipleButton);
    expect(formGroup.get('multiple')?.value).toBe(true);
    expect(formGroup.get('element')?.value).toBeFalsy();
    expect(formGroup.get('optional')?.value).toBe(true);
    expect(formGroup.get('element')?.disabled).toBe(true);
    expect(formGroup.get('optional')?.disabled).toBe(false);
  });

  it('should be able to specify optional for specific elements', () => {
    const stakeholder = stakeholders[0];
    formGroup.get('element')?.setValue(stakeholder);
    const optionalButton = spectator.query(
      byText('Optional')
    ) as HTMLInputElement;
    expect(formGroup.get('optional')?.value).toBe(false);
    spectator.click(optionalButton);
    expect(formGroup.get('optional')?.value).toBe(true);
    expect(formGroup.get('element')?.value).toBe(stakeholder);
  });
});
