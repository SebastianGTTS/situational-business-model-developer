import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DatabaseModule } from './database/database.module';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentProcessesModule } from './development-processes/development-processes.module';
import { DevelopmentProcessRegistryModule } from './development-process-registry/development-process-registry.module';
import { OptionsComponent } from './options/options.component';
import { CanvasMetaModelModule } from './canvas-meta-model/canvas-meta-model.module';
import { CanvasModule } from './canvas/canvas.module';
import { MethodModelerExplanationComponent } from './method-modeler-explanation/method-modeler-explanation.component';
import { FeatureModelerExplanationComponent } from './feature-modeler-explanation/feature-modeler-explanation.component';
import { EnactionExplanationComponent } from './enaction-explanation/enaction-explanation.component';
import { LoginComponent } from './login/login.component';
import { StartComponent } from './start/start.component';
import { StartBusinessDeveloperComponent } from './start-business-developer/start-business-developer.component';
import { StartMethodEngineerComponent } from './start-method-engineer/start-method-engineer.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuillModule } from 'ngx-quill';
import { WhiteboardMetaModelModule } from './whiteboard-meta-model/whiteboard-meta-model.module';
import { WhiteboardModule } from './whiteboard/whiteboard.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    OptionsComponent,
    ToolExplanationComponent,
    MethodModelerExplanationComponent,
    FeatureModelerExplanationComponent,
    EnactionExplanationComponent,
    LoginComponent,
    StartComponent,
    StartBusinessDeveloperComponent,
    StartMethodEngineerComponent,
    ChangePasswordFormComponent,
    ProfileComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    DatabaseModule,
    DevelopmentProcessRegistryModule,
    CanvasMetaModelModule,
    WhiteboardMetaModelModule,
    NgbModule,
    ReactiveFormsModule,

    QuillModule.forRoot({
      format: 'json',
    }),

    CanvasModule,
    WhiteboardModule,

    DevelopmentProcessesModule,

    AppRoutingModule, // has to be the last one
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
