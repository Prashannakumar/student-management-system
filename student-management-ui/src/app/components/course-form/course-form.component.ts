import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {
  course: Course = {
    courseId: 0,
    courseName: '',
    duration: '',
    courseFee: 0
  };
  isEditMode = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadCourse(id);
    }
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (data) => this.course = data,
      error: (err) => console.error('Error fetching course', err)
    });
  }

  saveCourse(): void {
    if (this.isEditMode) {
      this.courseService.updateCourse(this.course.courseId, this.course).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => console.error('Error updating course', err)
      });
    } else {
      this.courseService.saveCourse(this.course).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => console.error('Error saving course', err)
      });
    }
  }
}
