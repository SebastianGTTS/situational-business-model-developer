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


@NgModule({
  declarations: [
    AuthorFormComponent,
    AuthorInfoComponent,
    DescriptionFormComponent,
    FormArrayListComponent,
    DomainSelectionFormComponent,
    DomainsSelectionFormComponent,
  ],
  imports: [
    CommonModule,
    DevelopmentProcessViewModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,

    AuthorFormComponent,
    AuthorInfoComponent,
    DescriptionFormComponent,
    DevelopmentProcessViewModule,
    FormArrayListComponent,
    DomainsSelectionFormComponent,
  ],
})
export class SharedModule {
}
