import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Error fetching courses', err)
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course? This may affect registered students.')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
          alert('Course deleted successfully!');
        },
        error: (err) => console.error('Error deleting course', err)
      });
    }
  }
}
