import { AuthService } from 'src/app/service/auth/auth.service';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mainForm: FormGroup;
  showmessage: boolean = false;
  messagetext: string | undefined;
  returnUrl: string = '';
  error: string = '';

  showlogin: boolean
  showchangepassword: boolean
  showforgetpassword: boolean

  constructor(

    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder

  ) {
    this.mainForm = this.fb.group({
      loginForm: this.fb.group({
        username: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required)
      }),
      changepasswordForm: this.fb.group({
        oldpassword: new FormControl<string>('', Validators.required),
        newpassword: new FormControl<string>('', Validators.required),
        retypenewpassword: new FormControl<string>('', Validators.required)
      }),
      forgetpasswordForm: this.fb.group({
        emailfield: new FormControl<string>('', [
          Validators.required,
          Validators.email
        ])
      })
    })

    this.showlogin = true
    this.showchangepassword = false
    this.showforgetpassword = false


  }

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const userObj = JSON.parse(user);
      const token = userObj.token ? userObj.token : '';
      if (token) {
        if (this.tokenExpired(token)) {
          // === token was expire ===
          localStorage.clear();
        } else {
          // === token valid === 
          this.router.navigate(['/quotation-view'])
        }
      }
    }
  }

  submitForm(type: number) {
    const data = {
      username: this.mainForm.get('loginForm.username')?.value,
      password: this.mainForm.get('loginForm.password')?.value
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.authService.login(data.username, data.password, type)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data.status == 200) {
            // === contain user in database ==== 
            if (this.returnUrl == '/') {
              if (type == 1) {
                this.router.navigate(['/quotation-view']);

              } else if (type == 2) {
                this.router.navigate(['/quotation-view']);
              }
            } else {
              // this.router.navigate([this.returnUrl]);
              this.router.navigateByUrl(this.returnUrl)
            }
          } else if (data.status == 201) {
            // === Not found user id on database
            this.messagetext = `ไม่เจอผู้ใช้งานในระบบ หรือรหัสผ่านไม่ถูกต้อง`
            this.showmessage = true;
          }
        }, error: (error) => {
          this.error = error;
        }
      });
  }

  clikforgetpassword() {
    this.showforgetpassword = true
    this.showlogin = false
    this.showchangepassword = false
  }

  backtologin() {
    this.showlogin = true
    this.showchangepassword = false
    this.showforgetpassword = false
  }

  confirmemail() {

  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
