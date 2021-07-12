import { Component } from '@angular/core';
import { BmProcessService } from './development-process-registry/bm-process/bm-process.service';
import { BmProcess } from './development-process-registry/bm-process/bm-process';
import { DevelopmentMethodService } from './development-process-registry/development-method/development-method.service';
import { DevelopmentMethod } from './development-process-registry/development-method/development-method';
import { CompanyModelService } from './canvas-meta-model/company-model.service';
import { CompanyModel } from './canvas-meta-model/company-model';
import { ExpertModelService } from './canvas-meta-model/expert-model.service';
import { ExpertModel } from './canvas-meta-model/expert-model';
import { RunningProcessService } from './development-process-registry/running-process/running-process.service';
import { RunningProcess } from './development-process-registry/running-process/running-process';
import { DomainService } from './development-process-registry/knowledge/domain.service';
import { Domain } from './development-process-registry/knowledge/domain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private bmProcessService: BmProcessService,
    private companyModelService: CompanyModelService,
    private developmentMethodService: DevelopmentMethodService,
    private domainService: DomainService,
    private expertModelService: ExpertModelService,
    private runningProcessService: RunningProcessService,
  ) {
  }

  async printDevelopmentMethods() {
    const methods = (await this.developmentMethodService.getDevelopmentMethodList()).docs.map(
      (method) => new DevelopmentMethod(method)
    );
    const out = methods.map((method) => method.toPouchDb());
    out.forEach((method) => delete method._rev);
    console.log(out);
  }

  async printBmProcesses() {
    const processes = (await this.bmProcessService.getBmProcessList()).docs.map(
      (process) => new BmProcess(process)
    );
    const out = processes.map((process) => process.toPouchDb());
    out.forEach((process) => delete process._rev);
    console.log(out);
  }

  async printRunningProcesses() {
    const processes = (await this.runningProcessService.getRunningProcessesList()).docs.map(
      (process) => new RunningProcess(process)
    );
    const out = processes.map((process) => process.toPouchDb());
    out.forEach((process) => delete process._rev);
    console.log(out);
  }

  async printExpertModels() {
    const models = (await this.expertModelService.getList()).docs.map(
      (model) => new ExpertModel(model)
    );
    const out = models.map((model) => model.toPouchDb());
    out.forEach((model) => delete model._rev);
    console.log(out);
  }

  async printCompanyModels() {
    const models = (await this.companyModelService.getAll()).docs.map(
      (model) => new CompanyModel(model)
    );
    const out = models.map((model) => model.toPouchDb());
    out.forEach((model) => delete model._rev);
    console.log(out);
  }

  async printDomains() {
    const models = (await this.domainService.getList()).docs.map(
      (domain) => new Domain(domain)
    );
    const out = models.map((domain) => domain.toPouchDb());
    out.forEach((domain) => delete domain._rev);
    console.log(out);
  }

}
