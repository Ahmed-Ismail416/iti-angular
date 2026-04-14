import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CourseService } from "../../services/course.service";
import { DepartmentService } from "../../services/department.service";
import { Course, CreateCourse, UpdateCourse } from "../../models/course.model";
import { Department } from "../../models/department.model";

@Component({
  selector: "app-courses",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view">
      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h1 class="surface-title">Courses</h1>
            <p class="surface-sub">
              Maintain course catalog and map each course to a department.
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
          <div class="course-grid" *ngIf="courses.length">
            <article class="course-tile" *ngFor="let c of courses">
              <header>
                <span class="tile-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </span>
                <div class="tile-actions">
                  <button class="icon-btn" (click)="openEdit(c)" title="Edit">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button
                    class="icon-btn danger"
                    (click)="deleteCourse(c.id)"
                    title="Delete"
                  >
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
                </div>
              </header>

              <h3>{{ c.name }}</h3>

              <div class="tile-meta">
                <span class="chip accent">{{ c.duration }} hrs</span>
                <span class="chip">{{ c.departmentName }}</span>
              </div>
            </article>
          </div>

          <div class="empty-state" *ngIf="courses.length === 0">
            No courses available yet.
          </div>
        </div>
      </section>
    </div>

    <div class="dialog-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ editingId ? "Edit Course" : "Add Course" }}</h3>
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

          <div class="dialog-row">
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
            <div>
              <label class="field-label">Department</label>
              <select
                class="select-control"
                [(ngModel)]="form.departmentId"
                name="dept"
                required
              >
                <option [ngValue]="0" disabled>Select department</option>
                <option *ngFor="let d of departments" [ngValue]="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn-soft" (click)="closeModal()">
              Cancel
            </button>
            <button type="submit" class="btn-main" [disabled]="submitting">
              {{ submitting ? "Saving..." : editingId ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .course-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 12px;
      }
      .course-tile {
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.82);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: var(--ease-out);
      }
      .course-tile:hover {
        transform: translateY(-2px);
        border-color: var(--line-strong);
        box-shadow: var(--shadow-sm);
      }
      .course-tile header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .tile-icon {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        color: var(--accent-strong);
        background: var(--accent-soft);
      }
      .tile-actions {
        display: flex;
        gap: 6px;
      }
      .icon-btn {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink-muted);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: var(--ease-out);
      }
      .icon-btn:hover {
        color: var(--ink-strong);
        border-color: var(--line-strong);
      }
      .icon-btn.danger {
        border-color: rgba(180, 35, 24, 0.26);
        color: var(--danger);
        background: var(--danger-soft);
      }
      .icon-btn.danger:hover {
        background: #f6d6d4;
      }
      .course-tile h3 {
        font-size: 1.02rem;
        min-height: 44px;
      }
      .tile-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    `,
  ],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  departments: Department[] = [];
  showModal = false;
  editingId: number | null = null;
  submitting = false;
  form: any = { crs_Name: "", crs_Duration: 30, departmentId: 0 };

  constructor(
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.departmentService.getAll(1, 100).subscribe({
      next: (res) => {
        this.departments = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load departments", err);
      },
    });
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
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
    this.editingId = null;
    this.form = { crs_Name: "", crs_Duration: 30, departmentId: 0 };
    this.showModal = true;
  }

  openEdit(c: Course): void {
    this.editingId = c.id;
    this.form = {
      crs_Name: c.name,
      crs_Duration: c.duration,
      departmentId: c.departmentId,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.submitting = true;
    if (this.editingId) {
      this.courseService.update(this.editingId, this.form).subscribe({
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
    } else {
      this.courseService.create(this.form).subscribe({
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
  }

  deleteCourse(id: number): void {
    if (confirm("Delete this course?")) {
      this.courseService.delete(id).subscribe(() => this.loadCourses());
    }
  }
}
