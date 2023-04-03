import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorFormComponent } from './author-form/author-form.component';
import { DescriptionFormComponent } from './description-form/description-form.component';
import { DevelopmentProcessViewModule } from '../development-process-view/development-process-view.module';
import { FormArrayListComponent } from './form-array-list/form-array-list.component';
import { DomainSelectionFormComponent } from './domain-selection-form/domain-selection-form.component';
import { DomainsSelectionFormComponent } from './domains-selection-form/domains-selection-form.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { SearchComponent } from './search/search.component';
import { ListWrapperComponent } from './list-wrapper/list-wrapper.component';
import { RouterModule } from '@angular/router';
import { StepErrorsComponent } from './step-errors/step-errors.component';
import { FullscreenToggleComponent } from './fullscreen-toggle/fullscreen-toggle.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ListPanelComponent } from './list-panel/list-panel.component';
import { ElementNameFormComponent } from './element-name-form/element-name-form.component';
import { ElementOverviewComponent } from './element-overview/element-overview.component';
import { AuthorOverviewComponent } from './author-overview/author-overview.component';
import { IconFormComponent } from './icon-form/icon-form.component';
import { ElementFormComponent } from './element-form/element-form.component';
import { AuthorFilterComponent } from './author-filter/author-filter.component';
import { ElementNameModalComponent } from './element-name-modal/element-name-modal.component';
import { IconComponent } from './icon/icon.component';
import { ProfileComponent } from './profile/profile.component';
import { RoleSelectorComponent } from './role-selector/role-selector.component';

@NgModule({
  declarations: [
    AuthorFormComponent,
    DescriptionFormComponent,
    FormArrayListComponent,
    DomainSelectionFormComponent,
    DomainsSelectionFormComponent,
    DeleteModalComponent,
    SearchComponent,
    ListWrapperComponent,
    StepErrorsComponent,
    FullscreenToggleComponent,
    ListComponent,
    ListItemComponent,
    ListPanelComponent,
    ElementNameFormComponent,
    ElementOverviewComponent,
    AuthorOverviewComponent,
    IconFormComponent,
    ElementFormComponent,
    AuthorFilterComponent,
    ElementNameModalComponent,
    IconComponent,
    ProfileComponent,
    RoleSelectorComponent,
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

    AuthorFormComponent,
    DeleteModalComponent,
    DescriptionFormComponent,
    DevelopmentProcessViewModule,
    FormArrayListComponent,
    DomainsSelectionFormComponent,
    SearchComponent,
    ListWrapperComponent,
    StepErrorsComponent,
    FullscreenToggleComponent,
    ListComponent,
    ListPanelComponent,
    ElementNameFormComponent,
    ElementOverviewComponent,
    AuthorOverviewComponent,
    IconFormComponent,
    ListItemComponent,
    ElementFormComponent,
    AuthorFilterComponent,
    IconComponent,
    ProfileComponent,
    RoleSelectorComponent,
  ],
})
export class SharedModule {}
