import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorFormComponent } from './author-form/author-form.component';
import { AuthorInfoComponent } from './author-info/author-info.component';
import { DescriptionFormComponent } from './description-form/description-form.component';
import { DevelopmentProcessViewModule } from '../development-process-view/development-process-view.module';
import { FormArrayListComponent } from './form-array-list/form-array-list.component';
import { DomainSelectionFormComponent } from './domain-selection-form/domain-selection-form.component';
import { DomainsSelectionFormComponent } from './domains-selection-form/domains-selection-form.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { SearchComponent } from './search/search.component';
import { ListWrapperComponent } from './list-wrapper/list-wrapper.component';
import { ResultsListItemComponent } from './results-list-item/results-list-item.component';
import { RouterModule } from '@angular/router';
import { ApiNavigationComponent } from './api-navigation/api-navigation.component';
import { StepErrorsComponent } from './step-errors/step-errors.component';

@NgModule({
  declarations: [
    ApiNavigationComponent,
    AuthorFormComponent,
    AuthorInfoComponent,
    DescriptionFormComponent,
    FormArrayListComponent,
    DomainSelectionFormComponent,
    DomainsSelectionFormComponent,
    DeleteModalComponent,
    SearchComponent,
    ListWrapperComponent,
    ResultsListItemComponent,
    StepErrorsComponent,
  ],
  imports: [
    CommonModule,
    DevelopmentProcessViewModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,

    ApiNavigationComponent,
    AuthorFormComponent,
    AuthorInfoComponent,
    DeleteModalComponent,
    DescriptionFormComponent,
    DevelopmentProcessViewModule,
    FormArrayListComponent,
    DomainsSelectionFormComponent,
    SearchComponent,
    ListWrapperComponent,
    ResultsListItemComponent,
    StepErrorsComponent,
  ],
})
export class SharedModule {}
