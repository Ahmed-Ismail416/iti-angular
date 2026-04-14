import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell" [class.with-rail]="auth.isAuthenticated()">
      <app-navbar></app-navbar>
      <main class="app-stage" [class.auth-stage]="!auth.isAuthenticated()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .app-shell {
        min-height: 100vh;
      }
      .app-shell.with-rail {
        display: grid;
        grid-template-columns: 270px minmax(0, 1fr);
      }
      .app-stage {
        min-height: 100vh;
        padding: 28px 30px;
      }
      .app-stage.auth-stage {
        padding: 0;
      }
      @media (max-width: 980px) {
        .app-shell.with-rail {
          grid-template-columns: 1fr;
        }
        .app-stage {
          min-height: calc(100vh - 84px);
          padding: 18px;
        }
        .app-stage.auth-stage {
          min-height: 100vh;
          padding: 0;
        }
      }
    `,
  ],
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
