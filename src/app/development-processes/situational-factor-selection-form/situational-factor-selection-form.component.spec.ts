import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SituationalFactorSelectionFormComponent } from './situational-factor-selection-form.component';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionEntry,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { byText } from '@ngneat/spectator';

describe('Situational Factor Selection Form Component', () => {
  let spectator: SpectatorHost<SituationalFactorSelectionFormComponent>;
  const createHost = createHostFactory({
    component: SituationalFactorSelectionFormComponent,
    imports: [ReactiveFormsModule, NgbTypeaheadModule],
  });

  let formGroup: FormGroup;
  let situationalFactorDefinitions: SituationalFactorDefinitionEntry[];

  beforeEach(() => {
    situationalFactorDefinitions = [
      new SituationalFactorDefinition(undefined, {
        list: 'Test List',
        name: 'Test Factor',
        values: ['A', 'B'],
      }).toDb(),
      new SituationalFactorDefinition(undefined, {
        list: 'Test List',
        name: 'Other Factor',
        values: ['C', 'D'],
      }).toDb(),
    ];
    formGroup = new FormGroup({
      list: new FormControl('', Validators.required),
      element: new FormGroup({
        factor: new FormControl(null, Validators.required),
        value: new FormControl(null, Validators.required),
      }),
    });
    spectator = createHost(
      `
    <app-situational-factor-selection-form
      [formGroup]="formGroup"
      [listNames]="listNames"
      [methodElements]="situationalFactorDefinitions"
    ></app-situational-factor-selection-form>`,
      {
        hostProps: {
          formGroup,
          listNames: Array.from(
            new Set(
              ...situationalFactorDefinitions.map(
                (definition) => definition.list
              )
            )
          ),
          situationalFactorDefinitions,
        },
      }
    );
  });

  it('should be created', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should select real situational factor definitions', () => {
    const listField = spectator.query('#listInput') as HTMLInputElement;
    const inputField = spectator.query('#elementInput') as HTMLInputElement;
    spectator.typeInElement('Test', inputField);
    spectator.click(byText('Test Factor'));
    expect(inputField.value).toBe('Test Factor');
    expect(listField.value).toBe('Test List');
    const factorValue = formGroup.get('element')?.get('factor')?.value;
    expect(factorValue).toBeTruthy();
    expect(factorValue).toBeInstanceOf(SituationalFactorDefinition);
  });

  it('should be possible to select values', () => {
    const inputField = spectator.query('#elementInput') as HTMLInputElement;
    const valueField = spectator.query('#factorValue') as HTMLSelectElement;
    spectator.typeInElement('Test', inputField);
    spectator.click(byText('Test Factor'));
    const option = spectator.query(
      byText('A', { selector: 'option' })
    ) as HTMLOptionElement;
    spectator.selectOption(valueField, option);
    expect(valueField).toHaveSelectedOptions(option);
  });
});
