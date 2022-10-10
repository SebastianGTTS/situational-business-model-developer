import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import {
  Artifact,
  MetaModelData,
} from '../../development-process-registry/method-elements/artifact/artifact';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import {
  MetaModelDefinition,
  MetaModelIdentifier,
} from '../../development-process-registry/meta-model-definition';
import { ConfigurationFormPlaceholderDirective } from '../configuration-form-placeholder.directive';
import { ConfigurationFormComponent } from '../../development-process-registry/module-api/configuration-form-component';

@Component({
  selector: 'app-artifact-definition-form',
  templateUrl: './artifact-definition-form.component.html',
  styleUrls: ['./artifact-definition-form.component.css'],
})
export class ArtifactDefinitionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() artifact!: Artifact;

  @Output() submitArtifactForm = new EventEmitter<FormGroup>();

  definitionForm = this.fb.group(
    {
      internalArtifact: this.fb.control(false, Validators.required),
      metaModel: this.fb.control(null),
    },
    {
      validators: (group) => {
        if (
          group.get('internalArtifact')?.value &&
          !group.get('metaModel')?.value
        ) {
          return { requiredMetaModel: true };
        }
        return null;
      },
    }
  );
  changed = false;

  openMetaModelInput = new Subject<string>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost!: ConfigurationFormPlaceholderDirective;

  private changeSubscription?: Subscription;
  private changeMetaModelSubscription?: Subscription;
  private internalArtifactSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private metaModelService: MetaModelService
  ) {}

  ngOnInit(): void {
    if (this.metaModel != null) {
      this.initConfiguration(
        this.metaModelService.getMetaModelDefinition(this.metaModel.type),
        this.artifact.metaModelData
      );
    }
    this.changeSubscription = this.definitionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !this.equals(this.artifact, value)))
      )
      .subscribe();
    this.changeMetaModelSubscription = this.metaModelControl.valueChanges
      .pipe(tap(() => this.updateMetaModelData()))
      .subscribe();
    this.internalArtifactSubscription =
      this.internalArtifactControl.valueChanges
        .pipe(
          filter((value) => !value),
          tap(() => this.metaModelControl.setValue(null))
        )
        .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.artifact) {
      const oldArtifact: Artifact = changes.artifact.previousValue;
      const newArtifact: Artifact = changes.artifact.currentValue;
      if (!this.equals(newArtifact, oldArtifact)) {
        this.definitionForm.patchValue(newArtifact);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
    if (this.changeMetaModelSubscription != null) {
      this.changeMetaModelSubscription.unsubscribe();
    }
    if (this.internalArtifactSubscription != null) {
      this.internalArtifactSubscription.unsubscribe();
    }
    this.openMetaModelInput.complete();
  }

  private updateMetaModelData(): void {
    if (this.metaModel == null) {
      this.clearConfiguration();
    } else {
      this.initConfiguration(
        this.metaModelService.getMetaModelDefinition(this.metaModel.type)
      );
    }
  }

  private initConfiguration(
    metaModelDefinition?: MetaModelDefinition,
    metaModelData?: MetaModelData
  ): void {
    if (metaModelDefinition != null) {
      const api = metaModelDefinition.api;
      if (
        api.getMetaModelDataComponent != null &&
        api.createMetaModelDataForm != null &&
        api.equalMetaModelData != null
      ) {
        const metaModelDataFormGroup =
          api.createMetaModelDataForm(metaModelData);
        this.definitionForm.setControl('metaModelData', metaModelDataFormGroup);
        const viewContainerRef = this.configurationFormHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef =
          viewContainerRef.createComponent<ConfigurationFormComponent>(
            api.getMetaModelDataComponent()
          );
        componentRef.instance.formGroup = metaModelDataFormGroup;
      }
    }
  }

  private clearConfiguration(): void {
    this.configurationFormHost.viewContainerRef.clear();
    this.definitionForm.removeControl('metaModelData');
  }

  searchMetaModel = (
    input: Observable<string>
  ): Observable<MetaModelDefinition[]> => {
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

  formatter(x: { name: string }): string {
    return x.name;
  }

  private equals(artifactA: Artifact, artifactB: Artifact): boolean {
    if (artifactA == null && artifactB == null) {
      return true;
    }
    if (artifactA == null || artifactB == null) {
      return false;
    }
    if (artifactA.internalArtifact !== artifactB.internalArtifact) {
      return false;
    }
    if (!this.equalsMetaModel(artifactA.metaModel, artifactB.metaModel)) {
      return false;
    }
    if (artifactA.metaModel != null) {
      const api = this.metaModelService.getMetaModelApi(
        artifactA.metaModel.type
      );
      if (api.equalMetaModelData != null) {
        return api.equalMetaModelData(
          artifactA.metaModelData,
          artifactB.metaModelData
        );
      }
    }
    return true;
  }

  // noinspection JSMethodCanBeStatic
  private equalsMetaModel(
    metaModelA: MetaModelIdentifier | undefined,
    metaModelB: MetaModelIdentifier | undefined
  ): boolean {
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

  submitForm(): void {
    this.submitArtifactForm.emit(this.definitionForm);
  }

  get metaModels(): MetaModelDefinition[] {
    return this.metaModelService.metaModels;
  }

  get internalArtifactControl(): FormControl {
    return this.definitionForm.get('internalArtifact') as FormControl;
  }

  get metaModel(): MetaModelDefinition | undefined {
    return this.metaModelControl.value;
  }

  get metaModelControl(): FormControl {
    return this.definitionForm.get('metaModel') as FormControl;
  }
}
