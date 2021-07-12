import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-tools-selection-form',
  templateUrl: './tools-selection-form.component.html',
  styleUrls: ['./tools-selection-form.component.css']
})
export class ToolsSelectionFormComponent implements OnInit, OnChanges {

  @Input() tools: MultipleSelection<Tool>[][];

  @Output() submitToolsForm = new EventEmitter<FormArray>();

  toolsForm: FormGroup = this.fb.group({
    tools: this.fb.array([]),
  });

  methodElements: Tool[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private toolService: ToolService,
  ) {
  }

  ngOnInit() {
    this.loadTools();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tools) {
      this.loadForm(changes.tools.currentValue);
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
      this.fb.array(group.map((element) =>
        this.fb.group({
          list: [element.list, Validators.required],
          element: {value: element.element, disabled: element.multiple},
          multiple: element.multiple,
          multipleElements: {value: element.multipleElements, disabled: element.multiple},
        })
      )),
    );
    this.toolsForm.setControl('tools', this.fb.array(formArrays));
  }

  private loadTools() {
    this.toolService.getAll().then((tools) => {
      this.methodElements = tools.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  get formArray(): FormArray {
    return this.toolsForm.get('tools') as FormArray;
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
    multiple: false,
    multipleElements: false,
  })

}
