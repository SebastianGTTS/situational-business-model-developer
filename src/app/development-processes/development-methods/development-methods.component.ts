import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';

@Component({
  selector: 'app-development-methods',
  templateUrl: './development-methods.component.html',
  styleUrls: ['./development-methods.component.css']
})
export class DevelopmentMethodsComponent implements OnInit {

  developmentMethodsList: DevelopmentMethod[];

  developmentMethodForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadDevelopmentMethods();
  }

  loadDevelopmentMethods() {
    this.developmentMethodService.getDevelopmentMethodList().then(
      list => this.developmentMethodsList = list.docs
    ).catch(
      error => console.log('LoadDevelopmentMethods: ' + error)
    );
  }

  deleteDevelopmentMethod(id: string) {
    this.developmentMethodService.deleteDevelopmentMethod(id).then(
      () => this.loadDevelopmentMethods()
    ).catch(
      error => console.log('DeleteDevelopmentMethod: ' + error)
    );
  }

  addDevelopmentMethod(developmentMethodForm: FormGroup) {
    this.developmentMethodService.addDevelopmentMethod(developmentMethodForm.value.name).then(
      () => {
        this.developmentMethodForm.reset();
        this.loadDevelopmentMethods();
      }
    ).catch(
      error => console.log('AddDevelopmentMethod: ' + error)
    );
  }

}
