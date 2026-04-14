import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DepartmentService } from "../../services/department.service";
import {
  Department,
  CreateDepartment,
  UpdateDepartment,
} from "../../models/department.model";

@Component({
  selector: "app-departments",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="view">
      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h1 class="surface-title">Departments</h1>
            <p class="surface-sub">
              Configure structure, ownership, and linked courses.
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
            Add Department
          </button>
        </div>

        <div class="surface-body">
          <div class="dept-grid" *ngIf="departments.length">
            <article class="dept-tile" *ngFor="let d of departments">
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <div class="tile-actions">
                  <button class="icon-btn" (click)="openEdit(d)" title="Edit">
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
                    (click)="deleteDept(d.id)"
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

              <h3>{{ d.name }}</h3>
              <p class="tile-desc">
                {{ d.description || "No description available." }}
              </p>

              <div class="tile-meta">
                <span class="chip" *ngIf="d.location">{{ d.location }}</span>
                <span class="chip" *ngIf="!d.location">No location</span>
              </div>

              <div class="tile-stats">
                <div>
                  <strong>{{ d.studentsCount }}</strong>
                  <small>Students</small>
                </div>
                <div>
                  <strong>{{ d.coursesCount }}</strong>
                  <small>Courses</small>
                </div>
                <div>
                  <strong>{{ d.instructorsCount }}</strong>
                  <small>Instructors</small>
                </div>
              </div>

              <a
                [routerLink]="['/departments', d.id, 'courses']"
                class="btn-soft tile-link"
              >
                View Courses
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </article>
          </div>

          <div class="empty-state" *ngIf="departments.length === 0">
            No departments created yet.
          </div>
        </div>
      </section>
    </div>

    <div class="dialog-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ editingId ? "Edit Department" : "Add Department" }}</h3>
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
            <label class="field-label">Department Name</label>
            <input
              class="input-control"
              type="text"
              [(ngModel)]="form.dept_Name"
              name="name"
              required
            />
          </div>

          <div>
            <label class="field-label">Description</label>
            <input
              class="input-control"
              type="text"
              [(ngModel)]="form.dept_Desc"
              name="desc"
            />
          </div>

          <div>
            <label class="field-label">Location</label>
            <input
              class="input-control"
              type="text"
              [(ngModel)]="form.dept_Location"
              name="location"
            />
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
      .dept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
      }
      .dept-tile {
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.82);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: var(--ease-out);
      }
      .dept-tile:hover {
        transform: translateY(-2px);
        border-color: var(--line-strong);
        box-shadow: var(--shadow-sm);
      }
      .dept-tile header {
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
        color: var(--brand-strong);
        background: var(--brand-soft);
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
      .dept-tile h3 {
        font-size: 1.05rem;
      }
      .tile-desc {
        color: var(--ink-muted);
        font-size: 0.85rem;
        min-height: 38px;
      }
      .tile-meta {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        border-top: 1px dashed var(--line);
        padding-top: 10px;
      }
      .tile-stats strong {
        display: block;
        font-family: var(--font-display);
        color: var(--ink-strong);
        font-size: 1.1rem;
        line-height: 1.1;
      }
      .tile-stats small {
        font-size: 0.72rem;
        color: var(--ink-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .tile-link {
        width: 100%;
        justify-content: center;
        text-decoration: none;
        margin-top: 2px;
      }
    `,
  ],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  showModal = false;
  editingId: number | null = null;
  submitting = false;
  form: any = { dept_Name: "", dept_Desc: "", dept_Location: "" };

  constructor(
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAll(1, 100).subscribe({
      next: (res) => {
        this.departments = res.data ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load departments", err);
      },
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.form = { dept_Name: "", dept_Desc: "", dept_Location: "" };
    this.showModal = true;
  }

  openEdit(d: Department): void {
    this.editingId = d.id;
    this.form = {
      dept_Name: d.name,
      dept_Desc: d.description,
      dept_Location: d.location,
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
      this.departmentService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.submitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: () => {
          this.submitting = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.departmentService.create(this.form).subscribe({
        next: () => {
          this.submitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: () => {
          this.submitting = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  deleteDept(id: number): void {
    if (confirm("Delete this department?")) {
      this.departmentService.delete(id).subscribe(() => this.loadDepartments());
    }
  }
}
