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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    OptionsComponent,
    ToolExplanationComponent,
    MethodModelerExplanationComponent,
    FeatureModelerExplanationComponent,
    EnactionExplanationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DatabaseModule,
    DevelopmentProcessRegistryModule,
    CanvasMetaModelModule,
    NgbModule,
    ReactiveFormsModule,

    CanvasModule,

    DevelopmentProcessesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
