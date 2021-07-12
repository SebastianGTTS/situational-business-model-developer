import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { filter, map, tap } from 'rxjs/operators';
import { MetaModelService } from '../../development-process-registry/meta-model.service';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css']
})
export class ArtifactComponent implements OnInit, OnDestroy {

  artifact: Artifact;
  listNames: string[] = [];
  metaModels: { name: string, type: any }[];

  definitionForm = this.fb.group({
    internalArtifact: this.fb.control(false, Validators.required),
    metaModel: this.fb.control(null),
  }, {
    validators: (group) => {
      if (group.get('internalArtifact').value && !group.get('metaModel').value) {
        return {requiredMetaModel: true};
      }
      return null;
    },
  });

  openMetaModelInput = new Subject<string>();

  private routeSubscription: Subscription;
  private internalArtifactSubscription: Subscription;

  constructor(
    private artifactService: ArtifactService,
    private fb: FormBuilder,
    private metaModelService: MetaModelService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.metaModels = this.metaModelService.metaModels;
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => this.load(paramMap.get('id')));
    this.internalArtifactSubscription = this.internalArtifactControl.valueChanges.pipe(
      filter((value) => !value),
      tap(() => this.metaModelControl.setValue(null)),
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.openMetaModelInput.complete();
  }

  load(id: string) {
    this.artifactService.get(id).then((artifact) => {
      this.artifact = artifact;
      this.definitionForm.patchValue(this.artifact);
    }).catch(error => console.log('Load: ' + error));
    this.artifactService.getLists().then((lists) => this.listNames = lists.map((list) => list.listName)).catch(
      error => console.log('LoadLists: ' + error)
    );
  }

  updateValue(value: any) {
    const update = (currentElement: Artifact) => {
      currentElement.update(value);
      return currentElement;
    };
    this.artifactService.update(this.artifact._id, update).then(
      () => this.load(this.artifact._id)
    ).catch((error) => console.log('UpdateValue: ' + error));
  }

  searchMetaModel = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openMetaModelInput).pipe(
      map((term) => this.metaModels.filter((metaModelItem) => metaModelItem.name.toLowerCase().includes(term.toLowerCase())).slice(0, 7)),
    );
  }

  formatter(x: { name: string }) {
    return x.name;
  }

  get internalArtifactControl() {
    return this.definitionForm.get('internalArtifact') as FormControl;
  }

  get metaModelControl() {
    return this.definitionForm.get('metaModel') as FormControl;
  }

}
