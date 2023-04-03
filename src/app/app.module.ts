import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DatabaseModule } from './database/database.module';
import { NgModule } from '@angular/core';
import { DevelopmentProcessesModule } from './development-processes/development-processes.module';
import { HypoMoMapToolModule } from './modules/hypo-mo-map/hypo-mo-map-tool/hypo-mo-map-tool.module';
import { DevelopmentProcessRegistryModule } from './development-process-registry/development-process-registry.module';
import { CanvasMetaArtifactModule } from './modules/canvas/canvas-meta-artifact/canvas-meta-artifact.module';
import { CanvasToolModule } from './modules/canvas/canvas-tool/canvas-tool.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuillModule } from 'ngx-quill';
import { WhiteboardMetaArtifactModule } from './modules/whiteboard/whiteboard-meta-artifact/whiteboard-meta-artifact.module';
import { WhiteboardToolModule } from './modules/whiteboard/whiteboard-tool/whiteboard-tool.module';
import { HypoMoMapMetaArtifactModule } from './modules/hypo-mo-map/hypo-mo-map-meta-artifact/hypo-mo-map-meta-artifact.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewportScroller } from '@angular/common';
import { SbmdViewportScroller } from './sbmd-viewport-scroller';
import { RoleModule } from './role/role.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExplanationModule } from './explanation/explanation.module';
import { TutorialModule } from './tutorial/tutorial.module';
import { StartModule } from './start/start.module';
import { NavModule } from './nav/nav.module';
// import { ExampleArtifactModule } from './modules/example/example-artifact/example-artifact.module';
// import { ExampleToolModule } from './modules/example/example-tool/example-tool.module';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DatabaseModule,
    RoleModule,
    TutorialModule,
    DevelopmentProcessRegistryModule,
    CanvasMetaArtifactModule,
    HypoMoMapMetaArtifactModule,
    WhiteboardMetaArtifactModule,
    // ExampleArtifactModule,
    // Add your artifact modules here

    QuillModule.forRoot({
      format: 'json',
    }),

    CanvasToolModule,
    HypoMoMapToolModule,
    WhiteboardToolModule,
    // ExampleToolModule,
    // Add your tool modules here

    DevelopmentProcessesModule,
    DashboardModule,
    ExplanationModule,
    NavModule,
    StartModule,

    AppRoutingModule, // has to be the last one
  ],
  providers: [
    {
      provide: ViewportScroller,
      useExisting: SbmdViewportScroller,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
