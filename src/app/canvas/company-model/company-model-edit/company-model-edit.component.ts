import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { ActivatedRoute } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';

@Component({
  selector: 'app-company-model-edit',
  templateUrl: './company-model-edit.component.html',
  styleUrls: ['./company-model-edit.component.css']
})
export class CompanyModelEditComponent implements OnInit, OnDestroy {

  runningProcessId: string;
  companyModel: CompanyModel;

  private routeSubscription: Subscription;
  private queryParamSubscription: Subscription;

  constructor(
    private companyModelService: CompanyModelService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.queryParamSubscription = this.route.queryParamMap.subscribe((paramMap) => {
      this.runningProcessId = paramMap.get('runningProcessId');
    });
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadCompanyModel(paramMap.get('id'));
    });
  }

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    this.loadCompanyModel(this.companyModel._id);
  }

  async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
  }

}
