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
import {
  Domain,
  DomainEntry,
} from '../../development-process-registry/knowledge/domain';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../utils';
import { UPDATABLE, Updatable } from '../updatable';

@Component({
  selector: 'app-domains-selection-form',
  templateUrl: './domains-selection-form.component.html',
  styleUrls: ['./domains-selection-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: DomainsSelectionFormComponent },
  ],
})
export class DomainsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() domains!: Domain[];

  /**
   * Emits a form array containing of real domains,
   * i.e., of type Domain
   */
  @Output() submitDomainsForm = new EventEmitter<UntypedFormArray>();

  domainsForm: UntypedFormGroup = this.fb.group({
    domains: this.fb.array([]),
  });
  changed = false;

  domainDefinitions: DomainEntry[] = [];

  private changeSubscription?: Subscription;

  constructor(
    private domainService: DomainService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.domains) {
      const oldDomains: Domain[] = changes.domains.previousValue;
      const newDomains: Domain[] = changes.domains.currentValue;
      if (!equalsList(oldDomains, newDomains)) {
        this.loadForm(newDomains);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  add(): void {
    this.domainsFormArray.push(this.fb.control(null, Validators.required));
  }

  remove(index: number): void {
    this.domainsFormArray.removeAt(index);
  }

  private loadForm(domains: Domain[]): void {
    const formGroups = domains.map((domain) =>
      this.fb.control(domain, Validators.required)
    );
    this.domainsForm.setControl('domains', this.fb.array(formGroups));
  }

  submitForm(): void {
    this.submitDomainsForm.emit(this.domainsFormArray);
  }

  update(): void {
    if (this.changed && this.domainsForm.valid) {
      this.submitForm();
    }
  }

  get domainsFormArray(): UntypedFormArray {
    return this.domainsForm.get('domains') as UntypedFormArray;
  }

  private async loadDomains(): Promise<void> {
    this.domainDefinitions = await this.domainService.getList();
  }
}
