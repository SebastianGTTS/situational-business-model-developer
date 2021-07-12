import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-delete-feature-confirm',
  templateUrl: './delete-feature-confirm.component.html',
  styleUrls: ['./delete-feature-confirm.component.css']
})
export class DeleteFeatureConfirmComponent implements OnInit {

  @Input() feature: Feature;

  @Output() closeModal = new EventEmitter();
  @Output() deletionResult = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

}
