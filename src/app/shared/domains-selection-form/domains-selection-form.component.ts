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
import { Domain } from '../../development-process-registry/knowledge/domain';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../utils';

@Component({
  selector: 'app-domains-selection-form',
  templateUrl: './domains-selection-form.component.html',
  styleUrls: ['./domains-selection-form.component.css'],
})
export class DomainsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() domains: Domain[];

  @Output() submitDomainsForm = new EventEmitter<FormArray>();

  domainsForm: FormGroup = this.fb.group({
    domains: this.fb.array([]),
  });
  changed = false;

  domainDefinitions: Domain[] = [];

  private changeSubscription: Subscription;

  constructor(private domainService: DomainService, private fb: FormBuilder) {}

  ngOnInit() {
    void this.loadDomains();
    this.changeSubscription = this.domainsForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) => (this.changed = !equalsList(this.domains, value.domains))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domains) {
      const oldDomains: Domain[] = changes.domains.previousValue;
      const newDomains: Domain[] = changes.domains.currentValue;
      if (!equalsList(oldDomains, newDomains)) {
        this.loadForm(newDomains);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  add() {
    this.domainsFormArray.push(this.fb.control(null, Validators.required));
  }

  remove(index: number) {
    this.domainsFormArray.removeAt(index);
  }

  private loadForm(domains: Domain[]) {
    const formGroups = domains.map((domain) =>
      this.fb.control(domain, Validators.required)
    );
    this.domainsForm.setControl('domains', this.fb.array(formGroups));
  }

  submitForm() {
    this.submitDomainsForm.emit(this.domainsFormArray);
  }

  get domainsFormArray(): FormArray {
    return this.domainsForm.get('domains') as FormArray;
  }

  private async loadDomains(): Promise<void> {
    this.domainDefinitions = await this.domainService.getList();
  }
}
