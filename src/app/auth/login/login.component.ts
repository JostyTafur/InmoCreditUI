import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { LoginUser } from '../../model/login-user';
import { TokenService } from '../../services/token.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  hidePassword = true;
  roles: string[] = [];
  loginUser!: LoginUser;
  form = new FormGroup({
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router  
  ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
      if(this.isLogged){
        this.router.navigate(['/calculator']);
      }
    }
  }

  onLogin(): void {
    this.loginUser = new LoginUser(
      this.form.get('userName')?.value ?? '',
      this.form.get('password')?.value ?? '');

    this.authService.login(this.loginUser).subscribe(
      data => {
        this.isLogged = true;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.userName);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.router.navigate(['/calculator']);
      },
      err => {
        this.isLogged = false;
        console.log(err);
      }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}