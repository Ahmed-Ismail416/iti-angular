import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { DepartmentService } from "../../services/department.service";
import { Department } from "../../models/department.model";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="auth-layout register-layout">
      <aside class="auth-poster register-poster">
        <div class="poster-disc disc-a"></div>
        <div class="poster-disc disc-b"></div>
        <div class="poster-content">
          <p class="poster-kicker">Student Onboarding</p>
          <h2>Build your profile<br />and join your department.</h2>
          <p>
            Registration links your identity, department, and course access in
            one clean flow.
          </p>
          <div class="poster-notes">
            <span>Secure student onboarding</span>
            <span>Department-aware setup</span>
            <span>Immediate portal access</span>
          </div>
        </div>
      </aside>

      <section class="auth-panel">
        <div class="auth-card">
          <p class="auth-kicker">Create Account</p>
          <h1>Register as a student</h1>
          <p class="auth-copy">Complete the form to activate your profile.</p>

          <div class="status-box error" *ngIf="formError">{{ formError }}</div>
          <div class="status-box success" *ngIf="success">{{ success }}</div>

          <div class="dept-warning" *ngIf="deptError">
            <p>Departments could not be loaded from the API endpoint.</p>
            <button class="btn-soft" (click)="loadDepartments()">Retry</button>
          </div>

          <form (ngSubmit)="onRegister()" class="auth-form">
            <div class="dialog-row">
              <div>
                <label class="field-label">Full Name</label>
                <input
                  class="input-control"
                  type="text"
                  [(ngModel)]="form.fullName"
                  name="fullName"
                  placeholder="Ahmed Hassan"
                  required
                />
              </div>
              <div>
                <label class="field-label">Age</label>
                <input
                  class="input-control"
                  type="number"
                  [(ngModel)]="form.age"
                  name="age"
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <div>
              <label class="field-label">Email</label>
              <input
                class="input-control"
                type="email"
                [(ngModel)]="form.email"
                name="email"
                placeholder="ahmed@example.com"
                required
              />
            </div>

            <div>
              <label class="field-label">Password</label>
              <input
                class="input-control"
                type="password"
                [(ngModel)]="form.password"
                name="password"
                placeholder="Min 8 chars, uppercase, number, symbol"
                required
              />
            </div>

            <div class="dialog-row">
              <div>
                <label class="field-label">Department</label>
                <select
                  class="select-control"
                  [(ngModel)]="form.departmentId"
                  name="dept"
                >
                  <option [ngValue]="0" disabled>
                    {{ deptLoading ? "Loading..." : "Select department" }}
                  </option>
                  <option *ngFor="let d of departments" [ngValue]="d.id">
                    {{ d.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="field-label">Address</label>
                <input
                  class="input-control"
                  type="text"
                  [(ngModel)]="form.address"
                  name="address"
                  placeholder="Cairo, Egypt"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn-main submit-btn"
              [disabled]="loading"
            >
              <span class="loading-dot" *ngIf="loading"></span>
              {{ loading ? "Creating account..." : "Create account" }}
            </button>
          </form>

          <p class="auth-foot">
            Already registered?
            <a routerLink="/login">Sign in</a>
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
        grid-template-columns: 1fr 1fr;
      }
      .register-poster {
        position: relative;
        overflow: hidden;
        padding: 52px;
        color: #fff;
        background: linear-gradient(
          130deg,
          #1e7e53 0%,
          #0f766e 46%,
          #d9682c 100%
        );
      }
      .poster-disc {
        position: absolute;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.08);
      }
      .disc-a {
        width: 260px;
        height: 260px;
        top: -100px;
        right: -70px;
      }
      .disc-b {
        width: 180px;
        height: 180px;
        bottom: -70px;
        left: 16%;
      }
      .poster-content {
        position: relative;
        z-index: 1;
        max-width: 500px;
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
        font-size: clamp(2rem, 3.6vw, 3rem);
        line-height: 1.08;
        margin-bottom: 12px;
      }
      .poster-content p {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 16px;
        max-width: 460px;
      }
      .poster-notes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .poster-notes span {
        display: inline-flex;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.36);
        padding: 5px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.12);
      }
      .auth-panel {
        display: grid;
        place-items: center;
        padding: 24px;
      }
      .auth-card {
        width: min(520px, 100%);
        border-radius: 24px;
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.95);
        box-shadow: var(--shadow-md);
        padding: 28px;
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
        font-size: clamp(1.5rem, 2.6vw, 2.2rem);
        margin-bottom: 6px;
      }
      .auth-copy {
        color: var(--ink-muted);
        margin-bottom: 16px;
        font-size: 0.9rem;
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .dept-warning {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border: 1px solid rgba(154, 101, 13, 0.25);
        background: var(--warning-soft);
        color: var(--warning);
        padding: 10px;
        border-radius: 12px;
        margin-bottom: 12px;
        font-size: 0.82rem;
        font-weight: 600;
      }
      .submit-btn {
        width: 100%;
        justify-content: center;
        margin-top: 2px;
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
        margin-top: 14px;
        color: var(--ink-muted);
        font-size: 0.86rem;
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
        .register-poster {
          min-height: 200px;
          padding: 24px;
        }
        .auth-panel {
          padding: 18px;
        }
        .auth-card {
          padding: 24px 18px;
        }
        .poster-notes {
          display: none;
        }
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  form: any = {
    fullName: "",
    email: "",
    password: "",
    departmentId: 0,
    address: "",
    age: 20,
  };
  departments: Department[] = [];
  formError = "";
  success = "";
  loading = false;
  deptError = false;
  deptLoading = true;

  constructor(
    private auth: AuthService,
    private deptService: DepartmentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.deptError = false;
    this.deptLoading = true;
    this.cdr.detectChanges();
    this.deptService.getAll().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.deptLoading = false;
        this.deptError = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.deptLoading = false;
        this.deptError = true;
        this.cdr.detectChanges();
      },
    });
  }

  onRegister(): void {
    this.formError = "";
    this.success = "";
    this.loading = true;
    this.cdr.detectChanges();
    this.auth.register(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = "Account created! Redirecting to login...";
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.formError = err.error?.errors
          ? Array.isArray(err.error.errors)
            ? err.error.errors.join(", ")
            : JSON.stringify(err.error.errors)
          : err.error?.message ||
            "Registration failed. Please check your details.";
        this.cdr.detectChanges();
      },
    });
  }
}
