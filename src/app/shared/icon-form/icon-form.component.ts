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
import { FormBuilder, Validators } from '@angular/forms';
import { Icon, IconInit, IconTypes } from '../../model/icon';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Updatable, UPDATABLE } from '../updatable';
import { ImageLoaderService } from '../image-loader.service';

@Component({
  selector: 'app-icon-form',
  templateUrl: './icon-form.component.html',
  styleUrls: ['./icon-form.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: IconFormComponent }],
})
export class IconFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() disabled = false;
  @Input() icon!: Icon;
  @Output() submitIconForm = new EventEmitter<IconInit>();

  readonly colors = [
    { name: 'Blue', value: 'primary' },
    { name: 'Gray', value: 'secondary' },
    { name: 'Yellow', value: 'warning' },
    { name: 'Red', value: 'danger' },
    { name: 'Black', value: 'dark' },
  ];
  readonly icons: string[];

  form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<IconTypes>(
      IconTypes.PREDEFINED,
      Validators.required
    ),
    file: this.fb.control<string | null>(null),
    altText: [''],
    color: ['dark'],
    icon: ['bi-asterisk'],
  });
  changed = false;

  file?: File;
  imageLoadingError?: string;

  private typeChangeSubscription?: Subscription;
  private changeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private imageLoaderService: ImageLoaderService
  ) {
    this.icons = this.calculateIcons();
  }

  ngOnInit(): void {
    this.typeChangeSubscription = this.form
      .get('type')
      ?.valueChanges.subscribe(() => {
        this.form.get('file')?.setValue(null);
        this.file = undefined;
      });
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => {
          if (value.type !== this.icon.type) {
            this.changed = true;
          } else if (value.type === IconTypes.PREDEFINED) {
            this.changed =
              value.color !== this.icon.color || value.icon !== this.icon.icon;
          } else {
            this.changed =
              value.file != null || value.altText !== this.icon.altText;
          }
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.icon) {
      const oldIcon: Icon = changes.icon.previousValue;
      const newIcon: Icon = changes.icon.currentValue;
      if (changes.icon.firstChange || !this.equal(oldIcon, newIcon)) {
        this.updateForm(newIcon);
      }
    }
    if (changes.disabled) {
      if (this.disabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.typeChangeSubscription?.unsubscribe();
    this.changeSubscription?.unsubscribe();
  }

  async submitForm(): Promise<void> {
    if (this.form.getRawValue().type === IconTypes.PREDEFINED) {
      this.submitIconForm.emit({
        type: IconTypes.PREDEFINED,
        color: this.form.getRawValue().color,
        icon: this.form.getRawValue().icon,
        image: undefined,
      });
    } else if (this.form.getRawValue().type === IconTypes.CUSTOM) {
      try {
        let base64Image: string;
        if (this.icon.image == null || this.file != null) {
          base64Image = await this.imageLoaderService.loadImage(this.file);
        } else {
          base64Image = this.icon.image;
        }
        this.submitIconForm.emit({
          type: IconTypes.CUSTOM,
          image: base64Image,
          altText: this.form.getRawValue().altText,
        });
        this.form.get('file')?.setValue(null);
        this.file = undefined;
      } catch (error) {
        if (typeof error === 'string') {
          this.imageLoadingError = error;
        } else if (error instanceof Error) {
          this.imageLoadingError = error.message;
        } else {
          this.imageLoadingError =
            "Unknown Error. See browser's console for more info.";
        }
        throw error;
      }
    }
  }

  fileChange(event: Event): void {
    this.imageLoadingError = undefined;
    const fileInput = event.target as HTMLInputElement;
    this.file = fileInput.files?.[0];
  }

  async update(): Promise<void> {
    if (this.changed && this.form.valid) {
      await this.submitForm();
    }
  }

  private calculateIcons(): string[] {
    const icons: string[] = [
      'asterisk',
      'bicycle',
      'binoculars',
      'book',
      'box-seam',
      'box2',
      'boxes',
      'briefcase',
      'building-gear',
      'calculator',
      'calendar',
      'clipboard-data',
      'collection',
      'columns',
      'columns-gap',
      'database',
      'diagram-2',
      'diagram-3',
      'easel2',
      'file-earmark-richtext',
      'grid-1x2',
      'kanban',
      'list-check',
      'person',
      'window',
    ];

    // Add all numbers
    for (let i = 1; i < 10; ++i) {
      icons.push(i + '-circle', i + '-square');
    }

    return icons.map((icon) => 'bi-' + icon);
  }

  private updateForm(icon: Icon): void {
    this.form.setValue({
      type: icon.type,
      color: icon.color,
      icon: icon.icon,
      file: null,
      altText: icon.altText ?? '',
    });
  }

  private equal(oldIcon: Icon, newIcon: Icon): boolean {
    if (oldIcon.type !== newIcon.type) {
      return false;
    } else if (newIcon.type === IconTypes.PREDEFINED) {
      return newIcon.color === oldIcon.color && newIcon.icon === oldIcon.icon;
    } else {
      return (
        newIcon.image === oldIcon.image && newIcon.altText === oldIcon.altText
      );
    }
  }

  get currentColor(): string {
    return this.form.getRawValue().color;
  }

  get iconTypes(): typeof IconTypes {
    return IconTypes;
  }

  get iconType(): IconTypes {
    return this.form.getRawValue().type;
  }
}
