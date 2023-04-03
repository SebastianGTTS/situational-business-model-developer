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
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Comment } from '../../development-process-registry/running-process/comment';
import { AuthService } from '../../database/auth.service';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-running-process-method-comment-form',
  templateUrl: './running-process-method-comment-form.component.html',
  styleUrls: ['./running-process-method-comment-form.component.css'],
})
export class RunningProcessMethodCommentFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() comment?: Comment = undefined;

  @Output() submitCommentForm = new EventEmitter<UntypedFormGroup>();

  commentForm: UntypedFormGroup = this.fb.group({
    userName: ['', Validators.required],
    title: ['', Validators.required],
    comment: ['', Validators.required],
  });

  private userNameChangeSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    if (this.comment == null && this.authService.username != null) {
      this.userNameControl.disable();
      this.userNameControl.setValue(this.authService.username);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.userNameChangeSubscription = this.commentForm
        .get('userName')!
        .valueChanges.pipe(
          filter(
            (value) =>
              (value == null || value === '') &&
              this.authService.username != null
          ),
          tap(() => this.userNameControl.setValue(this.authService.username))
        )
        .subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.comment) {
      this.commentForm.patchValue(changes.comment.currentValue);
      this.userNameControl.disable();
    }
  }

  ngOnDestroy(): void {
    if (this.userNameChangeSubscription != null) {
      this.userNameChangeSubscription.unsubscribe();
    }
  }

  submit(): void {
    this.submitCommentForm.emit(this.commentForm);
  }

  get userNameControl(): UntypedFormControl {
    return this.commentForm.get('userName') as UntypedFormControl;
  }
}
