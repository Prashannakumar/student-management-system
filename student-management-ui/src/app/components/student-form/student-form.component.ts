import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { AiEnabledComponent } from '../../ai-interaction/base/ai-enabled.component';
import { AiAction } from '../../ai-interaction/decorators/ai-action.decorator';
import { FormRegistryService } from '../../ai-interaction/services/form-registry.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent extends AiEnabledComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private formRegistry = inject(FormRegistryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentForm!: FormGroup;
  courses: Course[] = [];
  isEditMode = false;
  studentId?: number;

  constructor() {
    super();
    this.initForm();
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Important for AI action registration
    this.loadCourses();
    this.formRegistry.registerForm('student-form', this.studentForm);

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.loadStudent(this.studentId);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.formRegistry.unregisterForm('student-form');
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      course: [null, Validators.required],
      totalFee: [{ value: 0, disabled: true }],
      paidFee: [0],
      balanceFee: [{ value: 0, disabled: true }]
    });

    // Handle fee calculations
    this.studentForm.get('course')?.valueChanges.subscribe(course => {
      if (course) {
        this.studentForm.patchValue({ totalFee: course.courseFee });
        this.calculateBalance();
      }
    });

    this.studentForm.get('paidFee')?.valueChanges.subscribe(() => {
      this.calculateBalance();
    });
  }

  /**
   * AI-Exposed capability to quickly fill common student data
   */
  @AiAction({
    description: 'Pre-fill the student form with demo data for testing',
    requiredRole: 'ADMIN'
  })
  fillDemoData() {
    this.studentForm.patchValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      paidFee: 500
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Error fetching courses', err)
    });
  }

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.studentForm.patchValue(data);
        if (data.course) {
          const selectedCourse = this.courses.find(c => c.courseId === data.course?.courseId);
          this.studentForm.patchValue({ course: selectedCourse });
        }
      },
      error: (err) => console.error('Error fetching student', err)
    });
  }

  calculateBalance(): void {
    const total = this.studentForm.get('totalFee')?.value || 0;
    const paid = this.studentForm.get('paidFee')?.value || 0;
    this.studentForm.get('balanceFee')?.patchValue(total - paid);
  }

  saveStudent(): void {
    if (this.studentForm.invalid) return;

    const studentData: Student = {
      ...this.studentForm.getRawValue(),
      studentId: this.studentId || 0
    };

    if (this.isEditMode && this.studentId) {
      this.studentService.updateStudent(this.studentId, studentData).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error updating student', err)
      });
    } else {
      this.studentService.saveStudent(studentData).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error saving student', err)
      });
    }
  }

  compareCourses(o1: Course, o2: Course): boolean {
    return o1 && o2 ? o1.courseId === o2.courseId : o1 === o2;
  }
}
