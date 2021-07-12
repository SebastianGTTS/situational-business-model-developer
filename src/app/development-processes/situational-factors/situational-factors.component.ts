import { Component, OnInit } from '@angular/core';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-situational-factors',
  templateUrl: './situational-factors.component.html',
  styleUrls: ['./situational-factors.component.css']
})
export class SituationalFactorsComponent implements OnInit {

  elementLists: { listName: string, elements: MethodElement[] }[] = null;
  listNames: string[] = [];

  constructor(
    private situationalFactorService: SituationalFactorService,
  ) {
  }

  ngOnInit() {
    this.loadSituationalFactors();
  }

  private loadSituationalFactors() {
    this.situationalFactorService.getLists().then(
      lists => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      },
    ).catch(
      error => console.log('LoadSituationalFactors: ' + error)
    );
  }

  deleteSituationalFactor(id: string) {
    this.situationalFactorService.delete(id).then(
      () => this.loadSituationalFactors()
    ).catch(
      error => console.log('DeleteSituationalFactor: ' + error)
    );
  }

  addSituationalFactor(situationalFactorForm: FormGroup) {
    this.situationalFactorService.add(situationalFactorForm.value).then(
      () => this.loadSituationalFactors()
    ).catch(
      error => console.log('AddSituationalFactor: ' + error)
    );
  }

}
