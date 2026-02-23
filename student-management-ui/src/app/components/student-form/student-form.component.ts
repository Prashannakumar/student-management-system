import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { extractFormMetadata } from '../../ai/utils/form-metadata.util';
import { AiContextService } from '../../ai/services/ai-context.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  courses: Course[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private aiContext: AiContextService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCourses();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadStudent(id);
    }

    const metadata = extractFormMetadata(this.studentForm);
    
    this.aiContext.setActiveForm(metadata);
    this.aiContext.setActiveFormGroup(this.studentForm);
  }

  buildForm(): void {
    this.studentForm = this.fb.group({
      studentId: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      course: [null, Validators.required],
      totalFee: [{ value: 0, disabled: true }],
      paidFee: [0, [Validators.required, Validators.min(0)]],
      balanceFee: [{ value: 0, disabled: true }]
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
        this.studentForm.patchValue({
          studentId: data.studentId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          course: data.course || null,
          paidFee: data.paidFee || 0
        });
        const total = data.totalFee ?? data.course?.courseFee ?? 0;
        const balance = total - (data.paidFee || 0);
        this.studentForm.patchValue({ totalFee: total, balanceFee: balance });
      },
      error: (err) => console.error('Error fetching student', err)
    });
  }

  onCourseChange(): void {
    const selected = this.studentForm.get('course')!.value as Course | null;
    if (selected) {
      const selectedCourse = this.courses.find(c => c.courseId === selected.courseId);
      if (selectedCourse) {
        this.studentForm.patchValue({ totalFee: selectedCourse.courseFee });
        this.calculateBalance();
      }
    }
  }

  calculateBalance(): void {
    const total = +this.studentForm.get('totalFee')!.value || 0;
    const paid = +this.studentForm.get('paidFee')!.value || 0;
    const balance = total - paid;
    this.studentForm.patchValue({ balanceFee: balance });
  }

  saveStudent(): void {
    // if (this.studentForm.invalid) return;
    const payload: Student = this.studentForm.getRawValue();
    if (this.isEditMode) {
      this.studentService.updateStudent(payload.studentId, payload).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error updating student', err)
      });
    } else {
      this.studentService.saveStudent(payload).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error saving student', err)
      });
    }
  }

  compareCourses(o1: Course, o2: Course): boolean {
    return o1 && o2 ? o1.courseId === o2.courseId : o1 === o2;
  }
}
