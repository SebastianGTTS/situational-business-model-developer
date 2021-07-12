import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelationshipType } from '../../../canvas-meta-model/relationships';

@Component({
  selector: 'app-cross-tree-relationship-form',
  templateUrl: './cross-tree-relationship-form.component.html',
  styleUrls: ['./cross-tree-relationship-form.component.css']
})
export class CrossTreeRelationshipFormComponent implements OnInit {

  @Input() featureList: { id: string, levelname: string }[];

  @Output() submitRelationshipForm = new EventEmitter<FormGroup>();

  relationshipForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadForm();
  }

  private loadForm() {
    this.relationshipForm = this.fb.group({
      relationshipType: RelationshipType.REQUIRES,
      fromFeatureId: [this.featureList.length > 0 ? this.featureList[0].id : null, Validators.required],
      toFeatureId: [this.featureList.length > 1 ? this.featureList[1].id : null, Validators.required],
    });
  }

  submitForm() {
    this.submitRelationshipForm.emit(this.relationshipForm);
    this.loadForm();
  }

}
