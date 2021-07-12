import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-development-methods-selection-form',
  templateUrl: './development-methods-selection-form.component.html',
  styleUrls: ['./development-methods-selection-form.component.css']
})
export class DevelopmentMethodsSelectionFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() developmentMethods: DevelopmentMethod[];
  @Input() contextSituationalFactors: { list: string, element: SituationalFactor }[] = [];

  @Output() selectDevelopmentMethod = new EventEmitter<DevelopmentMethod>();

  searchForm: FormGroup = this.fb.group({
    search: [''],
  });

  filteredDevelopmentMethods: DevelopmentMethod[];

  private searchSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.searchSubscription = this.searchForm.get('search').valueChanges.subscribe((value) => {
      if (value) {
        value = value.toLowerCase();
        this.filteredDevelopmentMethods = this.developmentMethods.filter((method) => method.name.toLowerCase().includes(value));
      } else {
        this.filteredDevelopmentMethods = this.developmentMethods;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.developmentMethods) {
      this.searchForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

}
