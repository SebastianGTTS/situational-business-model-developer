import { Component, OnInit } from '@angular/core';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-process-patterns',
  templateUrl: './process-patterns.component.html',
  styleUrls: ['./process-patterns.component.css']
})
export class ProcessPatternsComponent implements OnInit {

  processPatternList: ProcessPattern[];
  processPatternForm = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private processPatternService: ProcessPatternService,
  ) {
  }

  ngOnInit() {
    this.loadProcessPatterns();
  }

  private loadProcessPatterns() {
    this.processPatternService.getProcessPatternList().then(
      list => this.processPatternList = list.docs
    ).catch(
      error => console.log('LoadProcessPatterns: ' + error)
    );
  }

  deleteProcessPattern(id: string) {
    this.processPatternService.deleteProcessPattern(id).then(
      () => this.loadProcessPatterns()
    ).catch(
      error => console.log('DeleteProcessPattern: ' + error)
    );
  }

  addProcessPattern(processPatternForm: any) {
    this.processPatternService.addProcessPattern(processPatternForm.value.name).then(
      () => {
        this.processPatternForm.reset();
        this.loadProcessPatterns();
      }
    ).catch(
      error => console.log('AddProcessPattern: ' + error)
    );
  }

}
