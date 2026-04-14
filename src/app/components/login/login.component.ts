import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="auth-layout">
      <aside class="auth-poster">
        <div class="poster-disc disc-a"></div>
        <div class="poster-disc disc-b"></div>
        <div class="poster-content">
          <p class="poster-kicker">Campus Access Layer</p>
          <h2>One login.<br />Full academic operations.</h2>
          <p>
            Move between student records, departments, and courses from one
            command-focused workspace.
          </p>
          <ul>
            <li>Role-aware navigation for admin and student journeys.</li>
            <li>Structured CRUD workflows with cleaner focus states.</li>
            <li>Fast transitions across dashboard modules.</li>
          </ul>
        </div>
      </aside>

      <section class="auth-panel">
        <div class="auth-card">
          <p class="auth-kicker">Sign In</p>
          <h1>Enter your portal</h1>
          <p class="auth-copy">Use your account credentials to continue.</p>

          <div class="status-box error" *ngIf="error">{{ error }}</div>

          <form (ngSubmit)="onLogin()" class="auth-form">
            <div>
              <label class="field-label">Email</label>
              <input
                class="input-control"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="admin@test.com"
                required
              />
            </div>

            <div class="password-wrap">
              <label class="field-label">Password</label>
              <input
                class="input-control"
                [type]="showPw ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                class="eye-btn"
                (click)="showPw = !showPw"
                aria-label="Toggle password"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              class="btn-main submit-btn"
              [disabled]="loading"
            >
              <span class="loading-dot" *ngIf="loading"></span>
              {{ loading ? "Signing in..." : "Sign in" }}
            </button>
          </form>

          <p class="auth-foot">
            No account yet?
            <a routerLink="/register">Register as student</a>
          </p>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
      }
      .auth-poster {
        position: relative;
        padding: 56px;
        overflow: hidden;
        color: #fff;
        background: linear-gradient(
          135deg,
          #0f766e 0%,
          #128178 48%,
          #ea6f2d 100%
        );
      }
      .poster-disc {
        position: absolute;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.28);
        background: rgba(255, 255, 255, 0.08);
      }
      .disc-a {
        width: 300px;
        height: 300px;
        top: -110px;
        right: -80px;
      }
      .disc-b {
        width: 180px;
        height: 180px;
        bottom: -70px;
        left: 20%;
      }
      .poster-content {
        position: relative;
        z-index: 1;
        max-width: 540px;
      }
      .poster-kicker {
        font-size: 0.75rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-weight: 800;
        margin-bottom: 16px;
        opacity: 0.9;
      }
      .poster-content h2 {
        color: #fff;
        font-size: clamp(2rem, 4.2vw, 3.4rem);
        line-height: 1.05;
        margin-bottom: 14px;
      }
      .poster-content p {
        color: rgba(255, 255, 255, 0.9);
        max-width: 500px;
        margin-bottom: 18px;
      }
      .poster-content ul {
        display: grid;
        gap: 8px;
        font-size: 0.92rem;
        color: rgba(255, 255, 255, 0.9);
        padding-left: 18px;
      }
      .auth-panel {
        display: grid;
        place-items: center;
        padding: 28px;
      }
      .auth-card {
        width: min(460px, 100%);
        padding: 30px;
        border-radius: 24px;
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.95);
        box-shadow: var(--shadow-md);
      }
      .auth-kicker {
        text-transform: uppercase;
        letter-spacing: 0.13em;
        font-size: 0.7rem;
        color: var(--ink-muted);
        font-weight: 800;
        margin-bottom: 8px;
      }
      .auth-card h1 {
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        margin-bottom: 6px;
      }
      .auth-copy {
        color: var(--ink-muted);
        margin-bottom: 18px;
        font-size: 0.92rem;
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .password-wrap {
        position: relative;
      }
      .password-wrap .input-control {
        padding-right: 44px;
      }
      .eye-btn {
        position: absolute;
        right: 10px;
        top: 33px;
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--ink-muted);
        cursor: pointer;
      }
      .eye-btn:hover {
        background: var(--bg-soft);
      }
      .submit-btn {
        justify-content: center;
        margin-top: 4px;
        width: 100%;
      }
      .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      .loading-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.45);
        border-top-color: #fff;
        animation: spin 0.8s linear infinite;
      }
      .auth-foot {
        margin-top: 16px;
        color: var(--ink-muted);
        font-size: 0.88rem;
        text-align: center;
      }
      .auth-foot a {
        color: var(--brand-strong);
        font-weight: 700;
        text-decoration: none;
      }
      .auth-foot a:hover {
        text-decoration: underline;
      }
      @media (max-width: 980px) {
        .auth-layout {
          grid-template-columns: 1fr;
        }
        .auth-poster {
          min-height: 220px;
          padding: 28px 24px;
        }
        .poster-content ul {
          display: none;
        }
        .auth-panel {
          padding: 18px;
        }
        .auth-card {
          padding: 24px 18px;
        }
      }
    `,
  ],
})
export class LoginComponent {
  email = "";
  password = "";
  error = "";
  loading = false;
  showPw = false;
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (auth.isAuthenticated())
      router.navigate([auth.isAdmin() ? "/dashboard" : "/student-home"]);
  }
  onLogin(): void {
    this.error = "";
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([
          res.role === "Admin" ? "/dashboard" : "/student-home",
        ]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Invalid email or password";
      },
    });
  }
}
