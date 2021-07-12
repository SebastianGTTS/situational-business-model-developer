import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export function getTypeaheadInputPipe(input: Observable<string>) {
  return input.pipe(
    debounceTime(150),
    distinctUntilChanged(),
  );
}
