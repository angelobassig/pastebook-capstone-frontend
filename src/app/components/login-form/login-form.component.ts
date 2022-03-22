import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError } from 'src/app/models/api-error';
import { Login } from 'src/app/models/login';
import { LoginForm } from 'src/app/models/login-form';
import { LoginService } from 'src/app/services/login.service';
import { SessionService } from 'src/app/services/session.service';

import Swal from 'sweetalert2';

/**
 * Todo:
 * [] Implement remember me functionality
 * [] Implement forgot password functionality
 * [x] Implement a more robust input validation
 * [x] Refactor login handling
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnChanges {
  @Input() formData: LoginForm[];
  @Output() method = new EventEmitter<string>();

  isLoading = false;

  loginForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['formData'].firstChange) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    const formGroup = {};

    this.formData.forEach((formControl) => {
      formGroup[formControl.name] = new FormControl(null, Validators.required);
    });

    this.loginForm = new FormGroup(formGroup);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginService.login(this.loginForm.value).subscribe({
        next: this.successfulLogin.bind(this),
        error: this.failedLogin.bind(this),
      });
    }
  }

  successfulLogin(response: Login) {
    this.isLoading = false;
    Swal.fire(
      'Login Successful',
      'You have successfully logged in.',
      'success'
    );
    this.sessionService.setName(response.name);
    this.sessionService.setEmail(response.email);
    this.sessionService.setToken(response.token);
    this.sessionService.setUserId(response.id);
    this.sessionService.setIdNumber(response['idNumber']);
    this.sessionService.setProfileUrl(response['profileUrl']);
    this.router.navigate(['']);
    // this.router.navigate(['']).then(() => {
    // setTimeout(this.reloadPage, 2000);
    // });
  }

  failedLogin(error: ApiError) {
    this.isLoading = false;
    const { status } = error;
    if (status) {
      Swal.fire(
        'Login Failed',
        'You have entered incorrect credentials, please try again',
        'error'
      );
    } else {
      Swal.fire(
        'Login Failed',
        'User does not exist, please try again.',
        'error'
      );
    }
  }

  onMethodChange(method: string) {
    this.method.emit(method);
  }

  handleError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  reloadPage() {
    window.location.reload();
  }
}
