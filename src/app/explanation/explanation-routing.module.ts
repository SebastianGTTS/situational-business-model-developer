import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';
import { AuthGuard } from '../database/auth.guard';

const routes: Routes = [
  {
    path: 'explanation',
    component: ToolExplanationComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplanationRoutingModule {}
