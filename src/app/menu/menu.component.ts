import { TokenService } from '../services/token.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isLogged = false;
  isMenuOpen = true;
  roles: string[]=[];
  isAdmin = false;

  constructor(private tokenService: TokenService, private observer: BreakpointObserver, private router: Router){}

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
    } else{
      this.isLogged = false;
    }
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if(rol === "ROLE_ADMIN"){
        this.isAdmin = true;
      }
    })
  }

  ngAfterViewInit(): void {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe(res => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
    
  onLogOut(): void{
    this.tokenService.logOut();
    this.router.navigate(["/auth/login"]);
  }
}
