import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { NewUser } from 'src/app/model/new-user';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  newUser!: NewUser;
  roles: string[] = [
    ""
  ];
  isLogged = false;
  hidePassword = true;
  form = new FormGroup({
    userName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.min(8)]),
    fullname: new FormControl(null, [Validators.required, Validators.min(5)]),
    email: new FormControl(null, [Validators.required, Validators.email])
  });


  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router  ) { 
    
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
      if(this.isLogged){
        this.router.navigate(['/calculator']);
      }
    }
  }


  onRegister(): void{
    this.newUser = new NewUser(
      this.form.get('fullname')?.value ?? '',
      this.form.get('userName')?.value ?? '',
      this.form.get('email')?.value ?? '',
      this.form.get('password')?.value ?? '',
      this.roles);

    this.authService.newuser(this.newUser).subscribe(
      data => {
        this.router.navigate(['/auth/login']);
      },
      err => {
        console.log(err);
      }
    )
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}