import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DepartmentService } from "../../services/department.service";
import { CourseService } from "../../services/course.service";
import { Department } from "../../models/department.model";
import { Course, CreateCourse } from "../../models/course.model";

@Component({
  selector: "app-department-courses",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="view">
      <a routerLink="/departments" class="back-pill">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to departments
      </a>

      <section class="hero-panel dept-hero" *ngIf="department">
        <span class="hero-kicker">Department Focus</span>
        <h1 class="hero-title">{{ department.name }}</h1>
        <p class="hero-text">
          {{
            department.description ||
              "No description available for this department yet."
          }}
        </p>
        <div class="hero-meta">
          <span class="chip" *ngIf="department.location">{{
            department.location
          }}</span>
          <span class="chip brand">{{ courses.length }} courses</span>
        </div>
      </section>

      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h2 class="surface-title">Department Courses</h2>
            <p class="surface-sub">
              Manage all courses assigned to this department.
            </p>
          </div>
          <button class="btn-main" (click)="openAdd()">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Course
          </button>
        </div>

        <div class="surface-body">
          <div class="course-stack" *ngIf="courses.length">
            <article class="course-row" *ngFor="let c of courses">
              <div>
                <h4>{{ c.name }}</h4>
                <p>{{ c.duration }} hours</p>
              </div>
              <button class="icon-btn danger" (click)="deleteCourse(c.id)">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </article>
          </div>

          <div class="empty-state" *ngIf="courses.length === 0">
            No courses in this department yet.
          </div>
        </div>
      </section>
    </div>

    <div class="dialog-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Add Course to {{ department?.name }}</h3>
          <button class="dialog-close" (click)="closeModal()">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="dialog-form">
          <div>
            <label class="field-label">Course Name</label>
            <input
              class="input-control"
              type="text"
              [(ngModel)]="form.crs_Name"
              name="name"
              required
            />
          </div>

          <div>
            <label class="field-label">Duration (hours)</label>
            <input
              class="input-control"
              type="number"
              [(ngModel)]="form.crs_Duration"
              name="duration"
              required
            />
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn-soft" (click)="closeModal()">
              Cancel
            </button>
            <button type="submit" class="btn-main" [disabled]="submitting">
              {{ submitting ? "Adding..." : "Add Course" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .back-pill {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        width: fit-content;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--ink-muted);
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 12px;
        background: #fff;
      }
      .back-pill:hover {
        color: var(--ink-strong);
        border-color: var(--line-strong);
      }
      .dept-hero {
        margin-top: -6px;
      }
      .hero-meta {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .course-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .course-row {
        border: 1px solid var(--line);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.78);
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .course-row h4 {
        font-size: 0.95rem;
        margin-bottom: 2px;
      }
      .course-row p {
        color: var(--ink-muted);
        font-size: 0.82rem;
      }
      .icon-btn {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink-muted);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: var(--ease-out);
      }
      .icon-btn.danger {
        border-color: rgba(180, 35, 24, 0.26);
        color: var(--danger);
        background: var(--danger-soft);
      }
      .icon-btn.danger:hover {
        background: #f6d6d4;
      }
    `,
  ],
})
export class DepartmentCoursesComponent implements OnInit {
  departmentId: number = 0;
  department: Department | null = null;
  courses: Course[] = [];
  showModal = false;
  submitting = false;
  form: any = { crs_Name: "", crs_Duration: 30 };

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.departmentId = +this.route.snapshot.paramMap.get("id")!;
    this.departmentService.getById(this.departmentId).subscribe({
      next: (d) => {
        this.department = d;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load department", err);
      },
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.departmentService.getCourses(this.departmentId).subscribe({
      next: (data) => {
        this.courses = Array.isArray(data) ? data : ((data as any).data ?? []);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load courses", err);
      },
    });
  }

  openAdd(): void {
    this.form = { crs_Name: "", crs_Duration: 30 };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.submitting = true;
    const dto: CreateCourse = {
      crs_Name: this.form.crs_Name,
      crs_Duration: this.form.crs_Duration,
      departmentId: this.departmentId,
    };
    this.courseService.create(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.closeModal();
        this.loadCourses();
      },
      error: () => {
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteCourse(id: number): void {
    if (confirm("Delete this course?")) {
      this.courseService.delete(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => {
          console.error("Failed to delete course", err);
        },
      });
    }
  }
}
