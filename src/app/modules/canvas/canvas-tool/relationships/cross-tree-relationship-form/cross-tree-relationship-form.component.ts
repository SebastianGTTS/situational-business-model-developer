import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cross-tree-relationship-form',
  templateUrl: './cross-tree-relationship-form.component.html',
  styleUrls: ['./cross-tree-relationship-form.component.css'],
})
export class CrossTreeRelationshipFormComponent implements OnInit {
  @Input() featureList!: { id: string; levelname: string }[];
  @Input() relationshipTypes!: string[];

  @Output() submitRelationshipForm = new EventEmitter<UntypedFormGroup>();

  relationshipForm?: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.loadForm();
  }

  private loadForm(): void {
    this.relationshipForm = this.fb.group({
      relationshipType: [null, Validators.required],
      fromFeatureId: [
        this.featureList.length > 0 ? this.featureList[0].id : null,
        Validators.required,
      ],
      toFeatureId: [
        this.featureList.length > 1 ? this.featureList[1].id : null,
        Validators.required,
      ],
    });
  }

  submitForm(): void {
    this.submitRelationshipForm.emit(this.relationshipForm);
    this.loadForm();
  }
}
