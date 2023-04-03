import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConformanceReport } from '../../../canvas-meta-artifact/conformance-report';

@Component({
  selector: 'app-instance-hints',
  templateUrl: './instance-hints.component.html',
  styleUrls: ['./instance-hints.component.scss'],
})
export class InstanceHintsComponent {
  @Input() conformanceIsChecked!: boolean;
  @Input() conformanceOptionsForm!: FormGroup<{
    showWarnings: FormControl<boolean>;
    showStrengths: FormControl<boolean>;
    showHints: FormControl<boolean>;
    showPatternHints: FormControl<boolean>;
    showUsedPatterns: FormControl<boolean>;
  }>;
  @Input() conformance!: ConformanceReport;

  @Output() checkConformance = new EventEmitter<void>();
  @Output() uncheckConformance = new EventEmitter<void>();
}
