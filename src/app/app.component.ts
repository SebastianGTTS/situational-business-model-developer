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
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { PouchdbService } from './database/pouchdb.service';
import { AuthService } from './database/auth.service';
import { version } from '../environments/app.version';
import { environment } from '../environments/environment';
import { CanvasDefinitionService } from './canvas-meta-model/canvas-definition.service';
import { CanvasDefinition } from './canvas-meta-model/canvas-definition';
import { DatabaseMeta } from './database/database-entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  VERSION = version;

  constructor(
    private authService: AuthService,
    private bmProcessService: BmProcessService,
    private canvasDefinitionService: CanvasDefinitionService,
    private companyModelService: CompanyModelService,
    private developmentMethodService: DevelopmentMethodService,
    private domainService: DomainService,
    private expertModelService: ExpertModelService,
    ngbConfig: NgbConfig,
    private pouchdbService: PouchdbService,
    private runningProcessService: RunningProcessService
  ) {
    ngbConfig.animation = false;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  async addDefaultData(): Promise<void> {
    await this.pouchdbService.addDefaultData();
  }

  async printDevelopmentMethods(): Promise<void> {
    const methods = (await this.developmentMethodService.getList()).map(
      (method) => new DevelopmentMethod(method, undefined)
    );
    const out = methods.map((method) => method.toDb());
    out.forEach((method) => delete (method as DatabaseMeta)._rev);
    console.log(out);
  }

  async printBmProcesses(): Promise<void> {
    const processes = (await this.bmProcessService.getList()).map(
      (process) => new BmProcess(process, undefined)
    );
    const out = processes.map((process) => process.toDb());
    out.forEach((process) => delete (process as DatabaseMeta)._rev);
    console.log(out);
  }

  async printRunningProcesses(): Promise<void> {
    const processes = (await this.runningProcessService.getList()).map(
      (process) => new RunningProcess(process, undefined)
    );
    const out = processes.map((process) => process.toDb());
    out.forEach((process) => delete (process as DatabaseMeta)._rev);
    console.log(out);
  }

  async printExpertModels(): Promise<void> {
    const models = (await this.expertModelService.getList()).map(
      (model) => new ExpertModel(model, undefined)
    );
    const out = models.map((model) => model.toDb());
    out.forEach((model) => delete (model as DatabaseMeta)._rev);
    console.log(out);
  }

  async printCompanyModels(): Promise<void> {
    const models = (await this.companyModelService.getAll()).map(
      (model) => new CompanyModel(model, undefined)
    );
    const out = models.map((model) => model.toDb());
    out.forEach((model) => delete (model as DatabaseMeta)._rev);
    console.log(out);
  }

  async printDomains(): Promise<void> {
    const models = (await this.domainService.getList()).map(
      (domain) => new Domain(domain, undefined)
    );
    const out = models.map((domain) => domain.toDb());
    out.forEach((domain) => delete (domain as DatabaseMeta)._rev);
    console.log(out);
  }

  async printCanvasDefinitions(): Promise<void> {
    const models = (await this.canvasDefinitionService.getList()).map(
      (canvasDefinition) => new CanvasDefinition(canvasDefinition, undefined)
    );
    const out = models.map((canvasDefinition) => canvasDefinition.toDb());
    out.forEach(
      (canvasDefinition) => delete (canvasDefinition as DatabaseMeta)._rev
    );
    console.log(out);
  }

  get showNavbar(): boolean {
    return this.authService.isLoggedIn();
  }

  isLocalDatabase(): boolean {
    return environment.localDatabase === true;
  }
}
