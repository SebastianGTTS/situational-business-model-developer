import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { CompanyModel } from '../../modules/canvas/canvas-meta-artifact/company-model';
import { BmPhaseProcessService } from '../../development-process-registry/bm-process/bm-phase-process.service';
import { BmPatternProcessService } from '../../development-process-registry/bm-process/bm-pattern-process.service';

@Injectable()
export class MethodEngineerDashboardService {
  private _numberCompanyModels?: number;

  get numberOfCompanyModels(): number | undefined {
    return this._numberCompanyModels;
  }

  private _numberPhaseBasedMethods?: number;

  get numberOfPhaseBasedMethods(): number | undefined {
    return this._numberPhaseBasedMethods;
  }

  private _numberPatternBasedMethods?: number;

  get numberOfPatternBasedMethods(): number | undefined {
    return this._numberPatternBasedMethods;
  }

  constructor(
    private bmPhaseProcessService: BmPhaseProcessService,
    private bmPatternProcessService: BmPatternProcessService,
    private pouchdbService: PouchdbService
  ) {
    this.load();
  }

  private load(): void {
    void this.loadCompanyModels();
    void this.loadPhaseBasedMethods();
    void this.loadPatternBasedMethods();
  }

  private async loadCompanyModels(): Promise<void> {
    this._numberCompanyModels = (
      await this.pouchdbService.find(CompanyModel.typeName, {
        fields: [],
        selector: {
          createdByMethod: false,
        },
      })
    ).length;
  }

  private async loadPhaseBasedMethods(): Promise<void> {
    this._numberPhaseBasedMethods = (
      await this.bmPhaseProcessService.getList()
    ).length;
  }

  private async loadPatternBasedMethods(): Promise<void> {
    this._numberPatternBasedMethods = (
      await this.bmPatternProcessService.getList()
    ).length;
  }
}
