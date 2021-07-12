import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';

@Component({
  selector: 'app-process-patterns-selection-form',
  templateUrl: './process-patterns-selection-form.component.html',
  styleUrls: ['./process-patterns-selection-form.component.css']
})
export class ProcessPatternsSelectionFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() processPatterns: ProcessPattern[];
  @Input() contextSituationalFactors: { list: string, element: SituationalFactor }[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPattern>();

  searchForm: FormGroup = this.fb.group({
    search: [''],
  });

  filteredProcessPatterns: ProcessPattern[];

  private searchSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.searchSubscription = this.searchForm.get('search').valueChanges.subscribe((value) => {
      if (value) {
        value = value.toLowerCase();
        this.filteredProcessPatterns = this.processPatterns.filter((pattern) => pattern.name.toLowerCase().includes(value));
      } else {
        this.filteredProcessPatterns = this.processPatterns;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.processPatterns) {
      this.searchForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

}
