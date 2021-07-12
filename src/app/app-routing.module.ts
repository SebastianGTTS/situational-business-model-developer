import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './options/options.component';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';


// Routing for the Feature Modeler
const routes: Routes = [
  {path: '', redirectTo: '/runningprocess', pathMatch: 'full'},
  {path: 'options', component: OptionsComponent},
  {path: 'explanation', component: ToolExplanationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
