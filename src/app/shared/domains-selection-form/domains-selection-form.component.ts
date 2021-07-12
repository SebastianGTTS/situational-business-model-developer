import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';

@Component({
  selector: 'app-domains-selection-form',
  templateUrl: './domains-selection-form.component.html',
  styleUrls: ['./domains-selection-form.component.css']
})
export class DomainsSelectionFormComponent implements OnInit, OnChanges {

  @Input() domains: Domain[];

  @Output() submitDomainsForm = new EventEmitter<FormArray>();

  domainsForm: FormGroup = this.fb.group({
    domains: this.fb.array([]),
  });

  domainDefinitions: Domain[] = [];

  constructor(
    private domainService: DomainService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadDomains().then();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domains) {
      this.loadForm(changes.domains.currentValue);
    }
  }

  add() {
    this.domainsFormArray.push(this.fb.control(null, Validators.required));
  }

  remove(index: number) {
    this.domainsFormArray.removeAt(index);
  }

  private loadForm(domains: Domain[]) {
    const formGroups = domains.map((domain) => this.fb.control(domain, Validators.required));
    this.domainsForm.setControl('domains', this.fb.array(formGroups));
  }

  submitForm() {
    this.submitDomainsForm.emit(this.domainsFormArray);
  }

  get domainsFormArray(): FormArray {
    return this.domainsForm.get('domains') as FormArray;
  }

  private async loadDomains() {
    this.domainDefinitions = (await this.domainService.getList()).docs;
  }

}
