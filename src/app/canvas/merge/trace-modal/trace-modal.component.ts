import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-trace-modal',
  templateUrl: './trace-modal.component.html',
  styleUrls: ['./trace-modal.component.css']
})
export class TraceModalComponent implements OnInit {

  @Input() feature: Feature;
  @Input() tracedFeature: Feature;

  @Output() closeModal = new EventEmitter<null>();
  @Output() deleteTrace = new EventEmitter<null>();

  constructor() {
  }

  ngOnInit() {
  }

}
