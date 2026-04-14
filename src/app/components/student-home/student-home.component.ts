import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StudentService } from "../../services/student.service";
import { AuthService } from "../../services/auth.service";
import { StudentProfile } from "../../models/student.model";

@Component({
  selector: "app-student-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="loading-state" *ngIf="!profile && !error">
      <div class="loading-wrap">
        <div class="loading-core"></div>
        <p>Loading your dashboard...</p>
      </div>
    </div>

    <div class="view" *ngIf="error">
      <section class="workspace-surface">
        <div class="surface-body error-panel">
          <h3>Unable to load your dashboard</h3>
          <p>{{ error }}</p>
          <button class="btn-main" (click)="load()">Retry</button>
        </div>
      </section>
    </div>

    <div class="view" *ngIf="profile">
      <section class="hero-panel student-hero">
        <span class="hero-kicker">{{ greeting }}</span>
        <h1 class="hero-title">{{ profile.fullName }}</h1>
        <p class="hero-text">
          Welcome back. Your learning path and department details are ready.
        </p>
        <div class="hero-chips">
          <span class="chip">{{ profile.departmentName }}</span>
          <span class="chip brand"
            >{{ profile.courses?.length || 0 }} courses</span
          >
          <span class="chip accent">{{ totalHours }} total hours</span>
        </div>
      </section>

      <div class="metric-grid">
        <div class="metric-card metric-static">
          <span class="metric-icon"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg
          ></span>
          <div>
            <span class="metric-value">{{ profile.courses?.length || 0 }}</span>
            <span class="metric-label">Course Count</span>
          </div>
        </div>
        <div class="metric-card metric-static">
          <span class="metric-icon"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" /></svg
          ></span>
          <div>
            <span class="metric-value tiny">{{ profile.departmentName }}</span>
            <span class="metric-label">Department</span>
          </div>
        </div>
        <div class="metric-card metric-static">
          <span class="metric-icon"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" /></svg
          ></span>
          <div>
            <span class="metric-value">{{ totalHours }}</span>
            <span class="metric-label">Total Hours</span>
          </div>
        </div>
      </div>

      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h2 class="surface-title">Your Department</h2>
            <p class="surface-sub">Overview and location information.</p>
          </div>
        </div>
        <div class="surface-body dept-card">
          <h3>{{ profile.departmentName }}</h3>
          <p>
            {{
              profile.departmentDescription ||
                "No description available for this department yet."
            }}
          </p>
          <div class="dept-meta">
            <span class="chip" *ngIf="profile.departmentLocation">{{
              profile.departmentLocation
            }}</span>
            <span class="chip" *ngIf="!profile.departmentLocation"
              >Location not specified</span
            >
          </div>
        </div>
      </section>

      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h2 class="surface-title">Department Courses</h2>
            <p class="surface-sub">
              Current learning modules under your department.
            </p>
          </div>
        </div>
        <div class="surface-body">
          <div
            class="course-grid"
            *ngIf="profile.courses?.length; else noCourses"
          >
            <article class="course-tile" *ngFor="let c of profile.courses">
              <h4>{{ c.name }}</h4>
              <span class="chip accent">{{ c.duration }} hours</span>
            </article>
          </div>
          <ng-template #noCourses>
            <div class="empty-state">
              No courses assigned to your department yet.
            </div>
          </ng-template>
        </div>
      </section>
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
      .student-hero {
        margin-bottom: 2px;
      }
      .hero-chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .metric-static {
        cursor: default;
      }
      .metric-static:hover {
        transform: none;
      }
      .metric-value.tiny {
        font-size: 1rem;
        line-height: 1.2;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dept-card h3 {
        font-size: 1.2rem;
        margin-bottom: 6px;
      }
      .dept-card p {
        color: var(--ink-muted);
        margin-bottom: 10px;
        font-size: 0.9rem;
      }
      .dept-meta {
        display: flex;
        gap: 8px;
      }
      .course-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }
      .course-tile {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.78);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .course-tile h4 {
        font-size: 0.94rem;
      }
    `,
  ],
})
export class StudentHomeComponent implements OnInit {
  profile: StudentProfile | null = null;
  error = "";
  greeting = "";
  initials = "";
  totalHours = 0;

  constructor(
    private studentService: StudentService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    this.greeting =
      h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
    this.load();
  }

  load(): void {
    this.error = "";
    this.cdr.detectChanges();
    this.studentService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.initials = (data.fullName || "")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        this.totalHours = (data.courses || []).reduce(
          (sum: number, c: any) => sum + (c.duration || 0),
          0,
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || "Failed to load your dashboard.";
        this.cdr.detectChanges();
      },
    });
  }
}
