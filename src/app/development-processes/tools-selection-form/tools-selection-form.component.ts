import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsListOfLists } from '../../shared/utils';
import { ModuleService } from '../../development-process-registry/module-api/module.service';

@Component({
  selector: 'app-tools-selection-form',
  templateUrl: './tools-selection-form.component.html',
  styleUrls: ['./tools-selection-form.component.css'],
})
export class ToolsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() tools: MultipleSelection<Tool>[][];

  @Output() submitToolsForm = new EventEmitter<FormArray>();

  toolsForm: FormGroup = this.fb.group({
    tools: this.fb.array([]),
  });
  changed = false;

  methodElements: Tool[] = [];
  listNames: string[] = [];

  private changeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private toolService: ToolService
  ) {}

  ngOnInit() {
    void this.loadTools();
    this.changeSubscription = this.toolsForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !equalsListOfLists(this.tools, value.tools))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tools) {
      const oldToolGroups: MultipleSelection<Tool>[][] =
        changes.tools.previousValue;
      const newToolGroups: MultipleSelection<Tool>[][] =
        changes.tools.currentValue;
      if (!equalsListOfLists(oldToolGroups, newToolGroups)) {
        this.loadForm(newToolGroups);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  add() {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  submitForm() {
    this.submitToolsForm.emit(this.toolsForm.get('tools') as FormArray);
  }

  private loadForm(tools: MultipleSelection<Tool>[][]) {
    const formArrays = tools.map((group) =>
      this.fb.array(
        group.map((element) =>
          this.fb.group({
            list: [element.list, Validators.required],
            element: { value: element.element, disabled: element.multiple },
            multiple: element.multiple,
            multipleElements: {
              value: element.multipleElements,
              disabled: element.multiple,
            },
          })
        )
      )
    );
    this.toolsForm.setControl('tools', this.fb.array(formArrays));
  }

  private async loadTools(): Promise<void> {
    const tools = await this.toolService.getList();
    this.methodElements = tools.concat(
      this.moduleService.modules.map((module) => {
        return new Tool({
          name: module.name,
          list: module.list,
        });
      })
    );
    this.listNames = [
      ...new Set(
        this.methodElements
          .map((element) => element.list)
          .concat(this.moduleService.modules.map((module) => module.list))
      ),
    ];
  }

  get formArray(): FormArray {
    return this.toolsForm.get('tools') as FormArray;
  }

  createFormGroupFactory = () =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
      multiple: false,
      multipleElements: false,
    });
}
