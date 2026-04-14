import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StudentService } from "../../services/student.service";
import { DepartmentService } from "../../services/department.service";
import {
  Student,
  CreateStudent,
  UpdateStudent,
} from "../../models/student.model";
import { Department } from "../../models/department.model";

@Component({
  selector: "app-students",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view">
      <section class="workspace-surface">
        <div class="surface-head">
          <div>
            <h1 class="surface-title">Student Registry</h1>
            <p class="surface-sub">
              Track, update, and manage all student records.
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
            Add Student
          </button>
        </div>

        <div class="surface-body">
          <div class="toolbar">
            <div class="search-shell">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                class="input-control"
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterStudents()"
                placeholder="Search by name, email, department"
              />
            </div>
            <span class="chip brand">{{ filtered.length }} students</span>
          </div>

          <div class="table-shell">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of filtered">
                    <td>
                      <div class="name-cell">
                        <span class="avatar-mini">{{
                          getInitials(s.fullName)
                        }}</span>
                        <div>
                          <strong>{{ s.fullName }}</strong>
                          <small>ID #{{ s.id }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="muted">{{ s.email }}</td>
                    <td>
                      <span class="chip accent">{{ s.age }} yrs</span>
                    </td>
                    <td class="muted">{{ s.address }}</td>
                    <td>
                      <span class="chip">{{ s.departmentName }}</span>
                    </td>
                    <td>
                      <div class="row-actions">
                        <button
                          class="icon-btn"
                          (click)="openEdit(s)"
                          title="Edit"
                        >
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
                          (click)="deleteStudent(s.id)"
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
                    </td>
                  </tr>
                  <tr *ngIf="filtered.length === 0">
                    <td colspan="6">
                      <div class="empty-state">
                        No students match your current search.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="dialog-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ editingId ? "Edit Student" : "Add Student" }}</h3>
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
          <div class="status-box error" *ngIf="modalError">
            {{ modalError }}
          </div>

          <div class="dialog-row">
            <div>
              <label class="field-label">First Name</label>
              <input
                class="input-control"
                type="text"
                [(ngModel)]="form.st_Fname"
                name="fname"
                required
              />
            </div>
            <div>
              <label class="field-label">Last Name</label>
              <input
                class="input-control"
                type="text"
                [(ngModel)]="form.st_Lname"
                name="lname"
                required
              />
            </div>
          </div>

          <div class="dialog-row">
            <div>
              <label class="field-label">Age</label>
              <input
                class="input-control"
                type="number"
                [(ngModel)]="form.st_Age"
                name="age"
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

          <div>
            <label class="field-label">Address</label>
            <input
              class="input-control"
              type="text"
              [(ngModel)]="form.st_Address"
              name="address"
              required
            />
          </div>

          <div class="dialog-row" *ngIf="!editingId">
            <div>
              <label class="field-label">Email</label>
              <input
                class="input-control"
                type="email"
                [(ngModel)]="form.email"
                name="email"
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
                required
              />
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
      .name-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .avatar-mini {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: linear-gradient(145deg, var(--brand), var(--accent));
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }
      .name-cell strong {
        display: block;
        font-size: 0.9rem;
        color: var(--ink-strong);
      }
      .name-cell small {
        display: block;
        color: var(--ink-muted);
        font-size: 0.72rem;
      }
      .muted {
        color: var(--ink-muted);
        font-size: 0.86rem;
      }
      .row-actions {
        display: flex;
        gap: 6px;
      }
      .icon-btn {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink-muted);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: var(--ease-out);
      }
      .icon-btn:hover {
        border-color: var(--line-strong);
        color: var(--ink-strong);
      }
      .icon-btn.danger {
        color: var(--danger);
        border-color: rgba(180, 35, 24, 0.22);
        background: var(--danger-soft);
      }
      .icon-btn.danger:hover {
        background: #f6d6d4;
      }
    `,
  ],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filtered: Student[] = [];
  departments: Department[] = [];
  searchTerm = "";
  showModal = false;
  editingId: number | null = null;
  modalError = "";
  submitting = false;

  form: any = {
    st_Fname: "",
    st_Lname: "",
    st_Address: "",
    st_Age: 20,
    departmentId: 0,
    email: "",
    password: "",
  };

  constructor(
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
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

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = Array.isArray(data) ? data : ((data as any).data ?? []);
        this.filterStudents();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load students", err);
      },
    });
  }

  filterStudents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.departmentName?.toLowerCase().includes(term),
    );
  }

  getInitials(name: string): string {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "??"
    );
  }

  openAdd(): void {
    this.editingId = null;
    this.form = {
      st_Fname: "",
      st_Lname: "",
      st_Address: "",
      st_Age: 20,
      departmentId: 0,
      email: "",
      password: "",
    };
    this.modalError = "";
    this.showModal = true;
  }

  openEdit(s: Student): void {
    this.editingId = s.id;
    const names = s.fullName.split(" ");
    this.form = {
      st_Fname: names[0] || "",
      st_Lname: names.slice(1).join(" ") || "",
      st_Address: s.address,
      st_Age: s.age,
      departmentId: s.departmentId,
      email: "",
      password: "",
    };
    this.modalError = "";
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.modalError = "";
    this.submitting = true;

    if (this.editingId) {
      const dto: UpdateStudent = {
        st_Fname: this.form.st_Fname,
        st_Lname: this.form.st_Lname,
        st_Address: this.form.st_Address,
        st_Age: this.form.st_Age,
        departmentId: this.form.departmentId,
      };
      this.studentService.update(this.editingId, dto).subscribe({
        next: () => {
          this.submitting = false;
          this.closeModal();
          this.loadStudents();
        },
        error: (err) => {
          this.submitting = false;
          this.modalError = err.error?.message || "Update failed";
          this.cdr.detectChanges();
        },
      });
    } else {
      const dto: CreateStudent = { ...this.form };
      this.studentService.create(dto).subscribe({
        next: () => {
          this.submitting = false;
          this.closeModal();
          this.loadStudents();
        },
        error: (err) => {
          this.submitting = false;
          if (err.error?.errors) {
            this.modalError = Array.isArray(err.error.errors)
              ? err.error.errors.join(", ")
              : JSON.stringify(err.error.errors);
          } else {
            this.modalError = err.error?.message || "Creation failed";
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  deleteStudent(id: number): void {
    if (confirm("Are you sure you want to delete this student?")) {
      this.studentService.delete(id).subscribe(() => this.loadStudents());
    }
  }
}
