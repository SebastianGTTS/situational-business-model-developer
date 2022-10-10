import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MethodElementEntry } from '../../development-process-registry/method-elements/method-element';
import { merge, Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-method-element-info-selection',
  templateUrl: './method-element-info-selection.component.html',
  styleUrls: ['./method-element-info-selection.component.css'],
})
export class MethodElementInfoSelectionComponent implements OnDestroy {
  @Input() control!: FormControl;

  @Input() methodElementName!: string;
  @Input() index!: number;
  @Input() multiple!: boolean;
  @Input() list!: string;

  @Input() methodElements: MethodElementEntry[] = [];

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  openElementInput = new Subject<string>();

  ngOnDestroy(): void {
    this.openElementInput.complete();
  }

  searchElements = (
    input: Observable<string>
  ): Observable<MethodElementEntry[]> => {
    return merge(getTypeaheadInputPipe(input), this.openElementInput).pipe(
      map((term) =>
        this.methodElements
          .filter(
            (methodElement) =>
              methodElement.list.toLowerCase() === this.list.toLowerCase() &&
              methodElement.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  formatter(x: { name: string }): string {
    return x.name;
  }

  get formControl(): FormControl {
    return this.control;
  }
}
