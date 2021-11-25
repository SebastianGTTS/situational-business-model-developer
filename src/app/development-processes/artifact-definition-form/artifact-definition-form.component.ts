import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { debounceTime, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-artifact-definition-form',
  templateUrl: './artifact-definition-form.component.html',
  styleUrls: ['./artifact-definition-form.component.css'],
})
export class ArtifactDefinitionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() artifact: Artifact;

  @Output() submitArtifactForm = new EventEmitter<FormGroup>();

  definitionForm = this.fb.group(
    {
      internalArtifact: this.fb.control(false, Validators.required),
      metaModel: this.fb.control(null),
    },
    {
      validators: (group) => {
        if (
          group.get('internalArtifact').value &&
          !group.get('metaModel').value
        ) {
          return { requiredMetaModel: true };
        }
        return null;
      },
    }
  );
  changed = false;

  openMetaModelInput = new Subject<string>();

  private changeSubscription: Subscription;
  private internalArtifactSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private metaModelService: MetaModelService
  ) {}

  ngOnInit() {
    this.changeSubscription = this.definitionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !this.equals(this.artifact, value)))
      )
      .subscribe();
    this.internalArtifactSubscription =
      this.internalArtifactControl.valueChanges
        .pipe(
          filter((value) => !value),
          tap(() => this.metaModelControl.setValue(null))
        )
        .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.artifact) {
      const oldArtifact: Artifact = changes.artifact.previousValue;
      const newArtifact: Artifact = changes.artifact.currentValue;
      if (!this.equals(newArtifact, oldArtifact)) {
        this.definitionForm.patchValue(newArtifact);
      }
    }
  }

  ngOnDestroy() {
    if (this.internalArtifactSubscription) {
      this.internalArtifactSubscription.unsubscribe();
    }
    this.openMetaModelInput.complete();
  }

  searchMetaModel = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openMetaModelInput).pipe(
      map((term) =>
        this.metaModels
          .filter((metaModelItem) =>
            metaModelItem.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  formatter(x: { name: string }) {
    return x.name;
  }

  private equals(artifactA: Artifact, artifactB: Artifact) {
    if (artifactA == null && artifactB == null) {
      return true;
    }
    if (artifactA == null || artifactB == null) {
      return false;
    }
    return (
      artifactA.internalArtifact === artifactB.internalArtifact &&
      this.equalsMetaModel(artifactA.metaModel, artifactB.metaModel)
    );
  }

  private equalsMetaModel(
    metaModelA: { name: string; type: any },
    metaModelB: { name: string; type: any }
  ) {
    if (metaModelA == null && metaModelB == null) {
      return true;
    }
    if (metaModelA == null || metaModelB == null) {
      return false;
    }
    return (
      metaModelA.name === metaModelB.name && metaModelA.type === metaModelB.type
    );
  }

  submitForm() {
    this.submitArtifactForm.emit(this.definitionForm);
  }

  get metaModels() {
    return this.metaModelService.metaModels;
  }

  get internalArtifactControl() {
    return this.definitionForm.get('internalArtifact') as FormControl;
  }

  get metaModelControl() {
    return this.definitionForm.get('metaModel') as FormControl;
  }
}
