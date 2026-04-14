import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { StudentService } from "../../services/student.service";
import { AuthService } from "../../services/auth.service";
import { StudentProfile } from "../../models/student.model";

@Component({
  selector: "app-student-profile",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-state" *ngIf="!profile && !error">
      <div class="loading-wrap">
        <div class="loading-core"></div>
        <p>Loading profile...</p>
      </div>
    </div>

    <div class="view" *ngIf="error">
      <section class="workspace-surface">
        <div class="surface-body error-panel">
          <h3>Unable to load profile</h3>
          <p>{{ error }}</p>
          <button class="btn-main" (click)="loadProfile()">Try Again</button>
        </div>
      </section>
    </div>

    <div class="view" *ngIf="profile">
      <section class="hero-panel profile-hero">
        <div class="hero-layout">
          <div>
            <span class="hero-kicker">Student Profile</span>
            <h1 class="hero-title">{{ profile.fullName }}</h1>
            <p class="hero-text">{{ profile.email }}</p>
            <div class="hero-chips">
              <span class="chip">{{ profile.departmentName }}</span>
              <span class="chip brand"
                >{{ profile.courses?.length || 0 }} courses</span
              >
            </div>
          </div>
          <div class="hero-avatar">{{ getInitials() }}</div>
        </div>
      </section>

      <div class="profile-grid">
        <section class="workspace-surface">
          <div class="surface-head">
            <div>
              <h2 class="surface-title">Personal Information</h2>
              <p class="surface-sub">Your account and contact details.</p>
            </div>
          </div>
          <div class="surface-body info-stack">
            <article class="info-row">
              <span>Full Name</span>
              <strong>{{ profile.fullName }}</strong>
            </article>
            <article class="info-row">
              <span>Email</span>
              <strong>{{ profile.email }}</strong>
            </article>
            <article class="info-row">
              <span>Age</span>
              <strong>{{ profile.age }} years</strong>
            </article>
            <article class="info-row">
              <span>Address</span>
              <strong>{{ profile.address || "Not specified" }}</strong>
            </article>
          </div>
        </section>

        <section class="workspace-surface">
          <div class="surface-head">
            <div>
              <h2 class="surface-title">Department</h2>
              <p class="surface-sub">Program context and location details.</p>
            </div>
          </div>
          <div class="surface-body dept-stack">
            <h3>{{ profile.departmentName }}</h3>
            <p>
              {{
                profile.departmentDescription ||
                  "No department description provided."
              }}
            </p>
            <div class="dept-chips">
              <span class="chip" *ngIf="profile.departmentLocation">{{
                profile.departmentLocation
              }}</span>
              <span class="chip" *ngIf="!profile.departmentLocation"
                >Location not provided</span
              >
              <span class="chip accent"
                >{{ profile.courses?.length || 0 }} linked courses</span
              >
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        color: var(--ink-muted);
      }
      .error-panel {
        text-align: center;
      }
      .error-panel h3 {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }
      .error-panel p {
        color: var(--ink-muted);
        margin-bottom: 14px;
      }
      .profile-hero {
        margin-bottom: 2px;
      }
      .hero-layout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .hero-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .hero-avatar {
        width: 74px;
        height: 74px;
        border-radius: 18px;
        border: 2px solid rgba(255, 255, 255, 0.32);
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        display: grid;
        place-items: center;
        font-family: var(--font-display);
        font-size: 1.4rem;
        font-weight: 700;
        flex-shrink: 0;
      }
      .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .info-stack,
      .dept-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.76);
      }
      .info-row span {
        color: var(--ink-muted);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }
      .info-row strong {
        color: var(--ink-strong);
        font-size: 0.86rem;
        text-align: right;
      }
      .dept-stack h3 {
        font-size: 1.15rem;
      }
      .dept-stack p {
        color: var(--ink-muted);
        font-size: 0.9rem;
      }
      .dept-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      @media (max-width: 880px) {
        .hero-layout {
          flex-direction: column;
          align-items: flex-start;
        }
        .profile-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class StudentProfileComponent implements OnInit {
  profile: StudentProfile | null = null;
  error = "";

  constructor(
    private studentService: StudentService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.router.navigate(["/dashboard"]);
      return;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.error = "";
    this.cdr.detectChanges();
    this.studentService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error =
          err.error?.message ||
          "Failed to load your profile. Please try again.";
        this.cdr.detectChanges();
      },
    });
  }

  getInitials(): string {
    return (this.profile?.fullName || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
}
