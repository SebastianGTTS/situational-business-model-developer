import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './options/options.component';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './database/auth.guard';
import { LoginGuard } from './database/login.guard';
import { StartComponent } from './start/start.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Routing for the Feature Modeler
const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  {
    path: 'start',
    canActivate: [AuthGuard],
    component: StartComponent,
  },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'options', component: OptionsComponent, canActivate: [AuthGuard] },
  {
    path: 'explanation',
    component: ToolExplanationComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
