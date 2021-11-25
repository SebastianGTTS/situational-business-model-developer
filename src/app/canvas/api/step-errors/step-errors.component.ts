import { Component } from '@angular/core';
import { ProcessApiService } from '../process-api.service';

@Component({
  selector: 'app-step-errors',
  templateUrl: './step-errors.component.html',
  styleUrls: ['./step-errors.component.css'],
})
export class StepErrorsComponent {
  constructor(public processApiService: ProcessApiService) {}
}
