import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="rail" *ngIf="auth.isAuthenticated()">
      <div class="rail-brand">
        <div class="brand-seal">ITI</div>
        <div>
          <p class="brand-kicker">Academic Studio</p>
          <h2 class="brand-title">Portal Console</h2>
        </div>
      </div>

      <div class="rail-nav" *ngIf="auth.isAdmin()">
        <a
          routerLink="/dashboard"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="rail-link"
        >
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="8" height="8" />
              <rect x="13" y="3" width="8" height="5" />
              <rect x="13" y="11" width="8" height="10" />
              <rect x="3" y="14" width="8" height="7" /></svg
          ></span>
          Overview
        </a>
        <a routerLink="/students" routerLinkActive="active" class="rail-link">
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg
          ></span>
          Students
        </a>
        <a
          routerLink="/departments"
          routerLinkActive="active"
          class="rail-link"
        >
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" /></svg
          ></span>
          Departments
        </a>
        <a routerLink="/courses" routerLinkActive="active" class="rail-link">
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg
          ></span>
          Courses
        </a>
      </div>

      <div class="rail-nav" *ngIf="auth.isStudent()">
        <a
          routerLink="/student-home"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="rail-link"
        >
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" /></svg
          ></span>
          Home
        </a>
        <a
          routerLink="/student-profile"
          routerLinkActive="active"
          class="rail-link"
        >
          <span class="link-icon"
            ><svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg
          ></span>
          Profile
        </a>
      </div>

      <div class="rail-footer">
        <div class="user-card">
          <span class="avatar">{{ getInitials() }}</span>
          <div>
            <strong>{{ auth.getStoredName() }}</strong>
            <small>{{ auth.getRole() }}</small>
          </div>
        </div>
        <button class="signout" (click)="logout()" title="Sign out">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      .rail {
        position: sticky;
        top: 0;
        height: 100vh;
        padding: 20px 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        border-right: 1px solid var(--line);
        background: linear-gradient(
          175deg,
          rgba(255, 253, 248, 0.94),
          rgba(247, 241, 231, 0.88)
        );
        backdrop-filter: blur(4px);
      }
      .rail-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.62);
      }
      .brand-seal {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--hero-gradient);
        color: #fff;
        font-family: var(--font-display);
        font-size: 0.9rem;
        font-weight: 700;
        display: grid;
        place-items: center;
        letter-spacing: 0.08em;
        box-shadow: 0 10px 20px rgba(15, 118, 110, 0.25);
      }
      .brand-kicker {
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.62rem;
        color: var(--ink-muted);
        margin-bottom: 2px;
        font-weight: 700;
      }
      .brand-title {
        font-size: 1rem;
        line-height: 1.2;
      }
      .rail-nav {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .rail-link {
        text-decoration: none;
        border-radius: 12px;
        border: 1px solid transparent;
        color: var(--ink-muted);
        background: transparent;
        font-size: 0.86rem;
        font-weight: 700;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.18s ease;
      }
      .rail-link:hover {
        color: var(--ink-strong);
        border-color: var(--line);
        background: #fff;
      }
      .rail-link.active {
        color: #fff;
        border-color: transparent;
        background: var(--brand);
        box-shadow: 0 10px 20px rgba(15, 118, 110, 0.24);
      }
      .link-icon {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        display: grid;
        place-items: center;
        background: rgba(15, 118, 110, 0.12);
      }
      .rail-link.active .link-icon {
        background: rgba(255, 255, 255, 0.22);
      }
      .rail-footer {
        margin-top: auto;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.68);
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .user-card {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .avatar {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        background: linear-gradient(140deg, var(--brand), var(--accent));
        color: #fff;
        font-weight: 700;
        font-size: 0.8rem;
      }
      .user-card strong {
        display: block;
        color: var(--ink-strong);
        font-size: 0.83rem;
      }
      .user-card small {
        display: block;
        color: var(--ink-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.63rem;
        font-weight: 700;
      }
      .signout {
        border: 1px solid rgba(180, 35, 24, 0.25);
        border-radius: 10px;
        background: var(--danger-soft);
        color: var(--danger);
        font-size: 0.82rem;
        font-weight: 700;
        padding: 9px 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        transition: all 0.18s ease;
      }
      .signout:hover {
        background: #f7d8d6;
      }
      @media (max-width: 980px) {
        .rail {
          height: auto;
          border-right: 0;
          border-bottom: 1px solid var(--line);
          padding: 10px;
          gap: 8px;
          z-index: 80;
        }
        .rail-brand {
          justify-content: center;
        }
        .brand-kicker,
        .brand-title {
          display: none;
        }
        .brand-seal {
          width: 38px;
          height: 38px;
          border-radius: 10px;
        }
        .rail-nav {
          flex-direction: row;
          overflow-x: auto;
        }
        .rail-link {
          flex: 0 0 auto;
          white-space: nowrap;
          padding: 8px 10px;
        }
        .link-icon {
          width: 26px;
          height: 26px;
        }
        .rail-footer {
          margin-top: 0;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        .signout {
          width: auto;
        }
        .user-card small {
          display: none;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}
  getInitials(): string {
    return (this.auth.getStoredName() || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
