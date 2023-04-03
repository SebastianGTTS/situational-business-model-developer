import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../database/auth.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorReason?: string;

  expired = false;
  passwordChanged = false;
  dbError = false;

  private loginSubscription?: Subscription;
  private querySubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.querySubscription = this.route.queryParamMap.subscribe(
      (queryParamMap) => {
        this.expired =
          queryParamMap.has('expired') &&
          queryParamMap.get('expired') === 'true';
        this.passwordChanged =
          queryParamMap.has('passwordChanged') &&
          queryParamMap.get('passwordChanged') === 'true';
        this.dbError =
          queryParamMap.has('dbError') &&
          queryParamMap.get('dbError') === 'true';
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  async closeAlert(): Promise<void> {
    await this.router.navigate([]);
  }

  async login(): Promise<void> {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.errorReason = undefined;
    this.loginSubscription = this.authService
      .login(this.form.get('username')?.value, this.form.get('password')?.value)
      .subscribe(
        () => (this.errorReason = undefined),
        (error) => {
          console.error(error);
          if (error.message != null) {
            this.errorReason = error.message;
          }
          if (error.error != null && error.error.reason != null) {
            this.errorReason = error.error.reason;
          }
        }
      );
  }
}
