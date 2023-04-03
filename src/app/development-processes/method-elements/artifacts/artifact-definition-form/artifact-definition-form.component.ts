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
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import {
  Artifact,
  MetaArtifactData,
} from '../../../../development-process-registry/method-elements/artifact/artifact';
import { MetaArtifactService } from '../../../../development-process-registry/meta-artifact.service';
import { getTypeaheadInputPipe } from '../../../../shared/utils';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import {
  MetaArtifactDefinition,
  MetaArtifactIdentifier,
} from '../../../../development-process-registry/meta-artifact-definition';
import { ConfigurationFormPlaceholderDirective } from '../../../configuration-form-placeholder.directive';
import { ConfigurationFormComponent } from '../../../../development-process-registry/module-api/configuration-form-component';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-artifact-definition-form',
  templateUrl: './artifact-definition-form.component.html',
  styleUrls: ['./artifact-definition-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: ArtifactDefinitionFormComponent },
  ],
})
export class ArtifactDefinitionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() artifact!: Artifact;

  @Output() submitArtifactForm = new EventEmitter<UntypedFormGroup>();

  definitionForm = this.fb.group(
    {
      internalArtifact: this.fb.control(false, Validators.required),
      metaArtifact: this.fb.control(null),
    },
    {
      validators: (group) => {
        if (
          group.get('internalArtifact')?.value &&
          !group.get('metaArtifact')?.value
        ) {
          return { requiredMetaArtifact: true };
        }
        return null;
      },
    }
  );
  changed = false;

  openMetaArtifactInput = new Subject<string>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost!: ConfigurationFormPlaceholderDirective;

  private changeSubscription?: Subscription;
  private changeMetaArtifactSubscription?: Subscription;
  private internalArtifactSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private metaArtifactService: MetaArtifactService
  ) {}

  ngOnInit(): void {
    if (this.metaArtifact != null) {
      this.initConfiguration(
        this.metaArtifactService.getMetaArtifactDefinition(
          this.metaArtifact.type
        ),
        this.artifact.metaArtifactData
      );
    }
    this.changeSubscription = this.definitionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !this.equals(this.artifact, value)))
      )
      .subscribe();
    this.changeMetaArtifactSubscription = this.metaArtifactControl.valueChanges
      .pipe(tap(() => this.updateMetaArtifactData()))
      .subscribe();
    this.internalArtifactSubscription =
      this.internalArtifactControl.valueChanges
        .pipe(
          filter((value) => !value),
          tap(() => this.metaArtifactControl.setValue(null))
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
    if (this.changeMetaArtifactSubscription != null) {
      this.changeMetaArtifactSubscription.unsubscribe();
    }
    if (this.internalArtifactSubscription != null) {
      this.internalArtifactSubscription.unsubscribe();
    }
    this.openMetaArtifactInput.complete();
  }

  private updateMetaArtifactData(): void {
    if (this.metaArtifact == null) {
      this.clearConfiguration();
    } else {
      this.initConfiguration(
        this.metaArtifactService.getMetaArtifactDefinition(
          this.metaArtifact.type
        )
      );
    }
  }

  private initConfiguration(
    metaArtifactDefinition?: MetaArtifactDefinition,
    metaArtifactData?: MetaArtifactData
  ): void {
    if (metaArtifactDefinition != null) {
      const api = metaArtifactDefinition.api;
      if (
        api.getMetaArtifactDataComponent != null &&
        api.createMetaArtifactDataForm != null &&
        api.equalMetaArtifactData != null
      ) {
        const metaArtifactDataFormGroup =
          api.createMetaArtifactDataForm(metaArtifactData);
        this.definitionForm.setControl(
          'metaArtifactData',
          metaArtifactDataFormGroup
        );
        const viewContainerRef = this.configurationFormHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef =
          viewContainerRef.createComponent<ConfigurationFormComponent>(
            api.getMetaArtifactDataComponent()
          );
        componentRef.instance.formGroup = metaArtifactDataFormGroup;
      }
    }
  }

  private clearConfiguration(): void {
    this.configurationFormHost.viewContainerRef.clear();
    this.definitionForm.removeControl('metaArtifactData');
  }

  searchMetaArtifact = (
    input: Observable<string>
  ): Observable<MetaArtifactDefinition[]> => {
    return merge(getTypeaheadInputPipe(input), this.openMetaArtifactInput).pipe(
      map((term) =>
        this.metaArtifacts
          .filter((metaArtifactItem) =>
            metaArtifactItem.name.toLowerCase().includes(term.toLowerCase())
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
    if (
      !this.equalsMetaArtifact(artifactA.metaArtifact, artifactB.metaArtifact)
    ) {
      return false;
    }
    if (artifactA.metaArtifact != null) {
      const api = this.metaArtifactService.getMetaArtifactApi(
        artifactA.metaArtifact.type
      );
      if (api.equalMetaArtifactData != null) {
        return api.equalMetaArtifactData(
          artifactA.metaArtifactData,
          artifactB.metaArtifactData
        );
      }
    }
    return true;
  }

  // noinspection JSMethodCanBeStatic
  private equalsMetaArtifact(
    metaArtifactA: MetaArtifactIdentifier | undefined,
    metaArtifactB: MetaArtifactIdentifier | undefined
  ): boolean {
    if (metaArtifactA == null && metaArtifactB == null) {
      return true;
    }
    if (metaArtifactA == null || metaArtifactB == null) {
      return false;
    }
    return (
      metaArtifactA.name === metaArtifactB.name &&
      metaArtifactA.type === metaArtifactB.type
    );
  }

  submitForm(): void {
    this.submitArtifactForm.emit(this.definitionForm);
  }

  update(): void {
    if (this.changed && this.definitionForm.valid) {
      this.submitForm();
    }
  }

  get metaArtifacts(): MetaArtifactDefinition[] {
    return this.metaArtifactService.metaArtifacts;
  }

  get internalArtifactControl(): UntypedFormControl {
    return this.definitionForm.get('internalArtifact') as UntypedFormControl;
  }

  get metaArtifact(): MetaArtifactDefinition | undefined {
    return this.metaArtifactControl.value;
  }

  get metaArtifactControl(): UntypedFormControl {
    return this.definitionForm.get('metaArtifact') as UntypedFormControl;
  }
}
