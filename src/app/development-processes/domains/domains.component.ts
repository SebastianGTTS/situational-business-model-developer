import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: DomainService },
  ],
})
export class DomainsComponent {
  domainForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  modalDomain: Domain;
  private modalReference: NgbModalRef;

  @ViewChild('deleteDomainModal', { static: true })
  deleteDomainModal: any;

  constructor(
    private fb: FormBuilder,
    private listService: ListService<Domain>,
    private modalService: NgbModal
  ) {}

  async addDomain() {
    await this.listService.add(this.domainForm.value);
    this.domainForm.reset();
  }

  openDeleteDomainModal(domain: Domain) {
    this.modalDomain = domain;
    this.modalReference = this.modalService.open(this.deleteDomainModal, {
      size: 'lg',
    });
  }

  async deleteDomain(domain: Domain) {
    await this.listService.delete(domain._id);
  }

  getRouterLink(domain: Domain) {
    return ['/', 'domains', 'detail', domain._id];
  }

  get domains(): Domain[] {
    return this.listService.elements;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
