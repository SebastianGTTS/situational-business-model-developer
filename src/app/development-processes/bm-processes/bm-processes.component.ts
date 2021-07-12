import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';

@Component({
  selector: 'app-bm-processes',
  templateUrl: './bm-processes.component.html',
  styleUrls: ['./bm-processes.component.css']
})
export class BmProcessesComponent implements OnInit {

  bmProcessesList: BmProcess[];

  bmProcessForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadBmProcesss();
  }

  loadBmProcesss() {
    this.bmProcessService.getBmProcessList().then(
      list => this.bmProcessesList = list.docs
    ).catch(
      error => console.log('LoadBmProcesss: ' + error)
    );
  }

  deleteBmProcess(id: string) {
    this.bmProcessService.deleteBmProcess(id).then(
      () => this.loadBmProcesss()
    ).catch(
      error => console.log('DeleteBmProcess: ' + error)
    );
  }

  addBmProcess(bmProcessForm: FormGroup) {
    this.bmProcessService.addBmProcess(bmProcessForm.value.name).then(
      () => {
        this.bmProcessForm.reset();
        this.loadBmProcesss();
      }
    ).catch(
      error => console.log('AddBmProcess: ' + error)
    );
  }

}
