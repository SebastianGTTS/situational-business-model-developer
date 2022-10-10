import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ExampleToolRoutingModule } from './example-tool-routing.module';
import { ExampleToolService } from './example-tool.service';
import { SharedModule } from '../../../shared/shared.module';
import { ExampleCreateComponent } from './api/example-create/example-create.component';
import { ExampleEditComponent } from './api/example-edit/example-edit.component';
import { ExampleViewComponent } from './api/example-view/example-view.component';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (exampleToolService: ExampleToolService) => (): void =>
        exampleToolService.init(),
      deps: [ExampleToolService],
      multi: true,
    },
  ],
  imports: [SharedModule, ExampleToolRoutingModule],
  declarations: [
    ExampleCreateComponent,
    ExampleEditComponent,
    ExampleViewComponent,
  ],
})
export class ExampleToolModule {}
