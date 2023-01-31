import { AuthService } from 'src/app/service/auth/auth.service';
import { Validators, FormGroup, FormControl, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn, AbstractControlOptions } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // mainForm: FormGroup;
  showmessage: boolean = false;
  messagetext: string | undefined;
  returnUrl: string = '';
  error: string = '';

  errorforgotemail: string = '';
  successforgotpassword: boolean = false;

  errorresetpassword: string = '';
  successresetpassword: boolean = false

  // === hide or show password/retype password with icon click (25/10/2022) === 

  _oldPasswordType: boolean = false;
  _newPasswordType: boolean = false;
  _repeatPasswordType: boolean = false;
  _formresetchk: boolean = false;

  showlogin: boolean = true;
  showresetpassword: boolean = false;
  showforgetpassword: boolean = false;

  showexpiretxt: boolean = true;

  // === hide password status ===
  hide = true;


  // === login ===
  username = new FormControl<string>('', Validators.required)
  password = new FormControl<string>('', Validators.required)
  usertype = new FormControl<number | null>(null, Validators.required)

  // === forget password ===
  emailfield = new FormControl<string>('', [
    Validators.required,
    Validators.email
  ])

  // === reset password ===
  usernameField = new FormControl('', Validators.required)
  oldpasswordField = new FormControl('', Validators.required)
  newpasswordField = new FormControl('', Validators.compose([
    Validators.required,
    // check whether the entered password has a number
    this.patternValidator(/\d/, {
      hasNumber: true
    }),
    // check whether the entered password has upper case letter
    this.patternValidator(/[A-Z]/, {
      hasCapitalCase: true
    }),
    // check whether the entered password has a lower case letter
    this.patternValidator(/[a-z]/, {
      hasSmallCase: true
    }),
    // check whether the entered password has a special character
    this.patternValidator(
      /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      {
        hasSpecialCharacters: true
      }
    ),
    // check no other language (not allow include thai)
    this.patternNotmatchValidator(
      /[\u0E00-\u0E7F]/,
      {
        onlyEng: true
      }
    ),
    // check space include
    this.patternNotmatchValidator(
      /(\s)/,
      {
        spaceInclude: true
      }
    ),
    Validators.minLength(8)
  ]))
  retypenewpasswordField = new FormControl('', Validators.required)


  //  === Build Form ===
  // === login  form ===
  loginForm = this.fb.group({
    username: this.username,
    password: this.password,
    usertype: this.usertype
  })

  // === change password form ===
  changepasswordForm = this.fb.group({
    usernameField: this.usernameField,
    oldpasswordField: this.oldpasswordField,
    newpasswordField: this.newpasswordField,
    retypenewpasswordField: this.retypenewpasswordField
  }, { validator: this.checkIfMatchingPasswords('newpasswordField', 'retypenewpasswordField') } as AbstractControlOptions)

  // === reset password form ===
  forgetpasswordForm = this.fb.group({
    email: this.emailfield
  })

  mainForm = this.fb.group({
    loginForm: this.loginForm,
    changepasswordForm: this.changepasswordForm,
    forgetpasswordForm: this.forgetpasswordForm
  })


  constructor(

    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder

  ) {

  }

  get f(): { [key: string]: AbstractControl } {
    return this.mainForm.controls;
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    // return (control: AbstractControl): { [key: string]: any } => {
    return (control: AbstractControl): any => {
      if (!control.value) {
        // if control is empty return no error
        // return {'error': null};
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      // return valid ? {'error': null} :  error;
      return valid ? null : error;
    };
  }

  patternNotmatchValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    // return (control: AbstractControl): { [key: string]: any } => {
    return (control: AbstractControl): any => {
      if (!control.value) {
        // if control is empty return no error
        // return {'error': null};
        return null
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // opposite patternValidator
      // return valid ? error :  {'error': null};
      return valid ? error : null;
    };
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (controls: AbstractControl) => {
      let passwordInput = controls.get(passwordKey),
        passwordConfirmationInput = controls.get(passwordConfirmationKey);
      if (passwordInput?.value !== passwordConfirmationInput?.value) {
        return passwordConfirmationInput?.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput?.setErrors(null);
      }
    }
  }

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const userObj = JSON.parse(user);
      const token = userObj.token ? userObj.token : '';
      if (token) {
        if (this.authService.tokenExpired(token)) {
          // === token was expire ===
          localStorage.clear();
        } else {
          // === token valid === 
          this.router.navigate(['/quotation-view'])
        }
      }
    }
  }

  submitForm() {
    const data = {
      username: this.mainForm.controls.loginForm.controls.username.value ?? '',
      password: this.mainForm.controls.loginForm.controls.password.value ?? '',
      usertype: this.mainForm.controls.loginForm.controls.usertype.value ?? 1 // default 1 = 'checker'
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.authService.login(data.username, data.password, data.usertype)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result.status == 200) {
            // === contain user in database ==== 
            if (this.returnUrl == '/') {
              if (data.usertype == 1) {
                this.router.navigate(['/quotation-view']);

              } else if (data.usertype == 2) {
                this.router.navigate(['/quotation-view']);
              }
            } else {
              // this.router.navigate([this.returnUrl]);
              this.router.navigateByUrl(this.returnUrl)
            }
          } else if (result.status == 201) {
            // === Not found user id on database
            this.messagetext = `ไม่เจอผู้ใช้งานในระบบ หรือรหัสผ่านไม่ถูกต้อง`
            this.showmessage = true;
          }
        }, error: (error) => {
          this.error = error;
        }
      });
  }
  clickforgetpassword() {
    this.showforgetpassword = true
    this.showlogin = false
    this.showresetpassword = false
  }

  clickresetpassword() {
    this.showexpiretxt = false
    this.showforgetpassword = false
    this.showlogin = false
    this.showresetpassword = true
  }


  backtologin() {
    this.showexpiretxt = true
    this.showlogin = true
    this.showresetpassword = false
    this.showforgetpassword = false
  }

  confirmemail() {
    const useremail = this.mainForm.controls.forgetpasswordForm.controls.email.value ?? ''
    this.authService.forgetpassword({
      email: useremail
    }).pipe(first()).subscribe({
      next: (result) => {
        if (result.status == 200) {
          this.successforgotpassword = true
          this.errorforgotemail = 'ส่ง Email สำเร็จ, เช็ค Email เพื่อดำเนินการต่อ'
        } else {
          this.successforgotpassword = false
          this.errorforgotemail = result.message
        }
      }, error: (e) => {
        this.errorforgotemail = e
      }, complete: () => {
        // === do nothing ===
      }
    })
  }

  confirmnewpassword() {
    // === update password and expire date in oracledb ====
    this._formresetchk = true
    this.errorresetpassword = ''
    if (this.mainForm.controls.changepasswordForm.valid) {

      // === valid form ===

      let username = this.mainForm.controls.changepasswordForm.controls.usernameField.value ?? '',
        oldpassword = this.mainForm.controls.changepasswordForm.controls.oldpasswordField.value ?? '',
        newpassword = this.mainForm.controls.changepasswordForm.controls.newpasswordField.value ?? ''

      // console.log(`U: ${username}, ops:${oldpassword},nps:${newpassword}`)

      this.authService.resetpassword({
        username: username,
        oldpassword: oldpassword,
        newpassword: newpassword
      }).subscribe({
        next: (result) => {
          if (result.status == 200) {
            this.successresetpassword = true
            this.errorresetpassword = result.message
          } else {
            this.successresetpassword = false
            this.errorresetpassword = result.message
          }
        }, error: (e) => {
          // === handle error ==
          this.errorforgotemail = e
        }, complete: () => {
          // === do next step ===
        }
      })

    } else {

    }

  }

  toggleoldPasswordType() {
    this._oldPasswordType = !this._oldPasswordType
  }

  togglenewPasswordType() {
    this._newPasswordType = !this._newPasswordType;
  }

  toggleRepeatPasswordType() {
    this._repeatPasswordType = !this._repeatPasswordType;
  }


}
