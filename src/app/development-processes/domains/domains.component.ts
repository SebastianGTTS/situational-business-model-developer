import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { Domain } from '../../development-process-registry/knowledge/domain';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  domains: Domain[];

  domainForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private domainService: DomainService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadDomains().then();
  }

  async addDomain() {
    await this.domainService.add(this.domainForm.value);
    this.domainForm.reset();
    await this.loadDomains();
  }

  async deleteDomain(domain: Domain) {
    await this.domainService.delete(domain._id);
    await this.loadDomains();
  }

  async loadDomains() {
    this.domains = (await this.domainService.getList()).docs;
  }

  getRouterLink(domain: Domain) {
    return ['/', 'domains', 'detail', domain._id];
  }

}
