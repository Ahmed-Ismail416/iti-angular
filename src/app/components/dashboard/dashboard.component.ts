import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { StudentService } from "../../services/student.service";
import { DepartmentService } from "../../services/department.service";
import { CourseService } from "../../services/course.service";
import { Student } from "../../models/student.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="view">
      <section class="hero-panel dash-hero">
        <span class="hero-kicker">Admin Command Center</span>
        <h1 class="hero-title">Welcome back, {{ userName }}</h1>
        <p class="hero-text">
          Monitor enrollment, departments, and course inventory from one unified
          workspace.
        </p>
      </section>

      <div class="metric-grid">
        <a routerLink="/students" class="metric-card">
          <span class="metric-icon"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg
          ></span>
          <div>
            <span class="metric-value">{{ sCount }}</span>
            <span class="metric-label">Students</span>
          </div>
        </a>

        <a routerLink="/departments" class="metric-card">
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
            <span class="metric-value">{{ dCount }}</span>
            <span class="metric-label">Departments</span>
          </div>
        </a>

        <a routerLink="/courses" class="metric-card">
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
            <span class="metric-value">{{ cCount }}</span>
            <span class="metric-label">Courses</span>
          </div>
        </a>
      </div>

      <section class="workspace-surface" *ngIf="recentStudents.length">
        <div class="surface-head">
          <div>
            <h2 class="surface-title">Latest Student Activity</h2>
            <p class="surface-sub">Recently added student records</p>
          </div>
          <span class="chip brand"
            >{{ recentStudents.length }} recent entries</span
          >
        </div>
        <div class="surface-body recent-stack">
          <article class="recent-row" *ngFor="let s of recentStudents">
            <div class="recent-avatar">
              {{ s.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
            </div>
            <div class="recent-meta">
              <h4>{{ s.fullName }}</h4>
              <p>{{ s.email }}</p>
            </div>
            <span class="chip">{{ s.departmentName }}</span>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .dash-hero {
        margin-bottom: 2px;
      }
      .recent-stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .recent-row {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.7);
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: var(--ease-out);
      }
      .recent-row:hover {
        transform: translateY(-2px);
        border-color: var(--line-strong);
        background: #fff;
      }
      .recent-avatar {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        background: linear-gradient(140deg, var(--brand), var(--accent));
        color: #fff;
        font-weight: 700;
        font-size: 0.78rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }
      .recent-meta {
        flex: 1;
        min-width: 0;
      }
      .recent-meta h4 {
        font-size: 0.96rem;
        margin-bottom: 2px;
      }
      .recent-meta p {
        color: var(--ink-muted);
        font-size: 0.82rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @media (max-width: 640px) {
        .recent-row {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  userName = "";
  sCount = 0;
  dCount = 0;
  cCount = 0;
  recentStudents: Student[] = [];
  constructor(
    private auth: AuthService,
    private ss: StudentService,
    private ds: DepartmentService,
    private cs: CourseService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.userName = this.auth.getStoredName() || "Admin";
    this.ss.getAll().subscribe({
      next: (d) => {
        const list = Array.isArray(d) ? d : ((d as any).data ?? []);
        this.sCount = list.length;
        this.recentStudents = list.slice(-5).reverse();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load students", err);
      },
    });
    this.ds.getAll().subscribe({
      next: (d) => {
        this.dCount = d.total ?? (d as any).data?.length ?? 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load departments", err);
      },
    });
    this.cs.getAll().subscribe({
      next: (d) => {
        const list = Array.isArray(d) ? d : ((d as any).data ?? []);
        this.cCount = list.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load courses", err);
      },
    });
  }
}
