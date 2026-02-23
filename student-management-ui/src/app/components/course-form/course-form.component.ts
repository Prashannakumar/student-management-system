import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { extractFormMetadata } from '../../ai/utils/form-metadata.util';
import { AiContextService } from '../../ai/services/ai-context.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private aiContext: AiContextService
  ) { }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      courseId: [0],
      courseName: ['', Validators.required],
      duration: ['', Validators.required],
      courseFee: [0, [Validators.required, Validators.min(0)]]
    });

    const id = +this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadCourse(id);
    }

    const metadata = extractFormMetadata(this.courseForm);

    this.aiContext.setActiveForm(metadata);
    this.aiContext.setActiveFormGroup(this.courseForm);
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (data) => this.courseForm.patchValue(data),
      error: (err) => console.error('Error fetching course', err)
    });
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    const course = this.courseForm.value;

    if (this.isEditMode) {
      this.courseService.updateCourse(course.courseId, course).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => console.error('Error updating course', err)
      });
    } else {
      this.courseService.saveCourse(course).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => console.error('Error saving course', err)
      });
    }
  }
}
