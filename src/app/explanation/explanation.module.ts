import { NgModule } from '@angular/core';

import { ExplanationRoutingModule } from './explanation-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';
import { MethodCompositionExplanationComponent } from './method-composition-explanation/method-composition-explanation.component';
import { MethodEnactmentExplanationComponent } from './method-enactment-explanation/method-enactment-explanation.component';
import { KnowledgeProvisionExplanationComponent } from './knowledge-provision-explanation/knowledge-provision-explanation.component';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    CarouselComponent,
    KnowledgeProvisionExplanationComponent,
    MethodCompositionExplanationComponent,
    MethodEnactmentExplanationComponent,
    ToolExplanationComponent,
  ],
  imports: [SharedModule, ExplanationRoutingModule],
})
export class ExplanationModule {}
