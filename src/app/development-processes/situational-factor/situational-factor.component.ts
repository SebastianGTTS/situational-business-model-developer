import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import {
  SituationalFactorDefinition
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-situational-factor',
  templateUrl: './situational-factor.component.html',
  styleUrls: ['./situational-factor.component.css']
})
export class SituationalFactorComponent implements OnInit, OnDestroy {

  situationalFactor: SituationalFactorDefinition;
  listNames: string[] = [];

  form: FormGroup = this.fb.group({
    list: ['', Validators.required],
    values: this.fb.array([]),
  });
  orderedForm: FormGroup = this.fb.group({
    ordered: [false, Validators.required],
  });

  openListInput = new Subject<string>();

  private routeSubscription: Subscription;
  private orderedSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorService: SituationalFactorService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => this.loadSituationalFactor(paramMap.get('id')));
    this.orderedSubscription = this.orderedForm.valueChanges.subscribe((formValue) => this.updateSituationalFactorValue(formValue));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.orderedSubscription) {
      this.orderedSubscription.unsubscribe();
    }
    this.openListInput.complete();
  }

  loadSituationalFactor(id: string) {
    this.situationalFactorService.get(id).then(
      (situationalFactor) => {
        this.situationalFactor = situationalFactor;
        this.form.patchValue(situationalFactor);
        this.valuesFormArray.clear();
        this.situationalFactor.values.forEach(
          (value, index) => this.valuesFormArray.setControl(index, this.fb.control(value, Validators.required))
        );
        this.orderedForm.patchValue(situationalFactor, {emitEvent: false});
      }
    ).catch(
      error => console.log('LoadSituationalFactor: ' + error)
    );
    this.situationalFactorService.getLists().then((lists) => this.listNames = lists.map((list) => list.listName)).catch(
      error => console.log('LoadLists: ' + error)
    );
  }

  updateSituationalFactor(form: FormGroup) {
    this.updateSituationalFactorValue(form.value);
  }

  updateSituationalFactorValue(value: any) {
    const update = (currentElement: SituationalFactorDefinition) => {
      currentElement.update(value);
      return currentElement;
    };
    this.situationalFactorService.update(this.situationalFactor._id, update).then(
      () => this.loadSituationalFactor(this.situationalFactor._id)
    ).catch(
      error => console.log('UpdateSituationalFactorValue: ' + error)
    );
  }

  get valuesFormArray() {
    return this.form.get('values') as FormArray;
  }

  searchLists = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) => this.listNames.filter((listItem) => listItem.toLowerCase().includes(term.toLowerCase())).slice(0, 10)),
    );
  }

}
