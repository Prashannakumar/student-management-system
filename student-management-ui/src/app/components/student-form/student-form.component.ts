import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent implements OnInit {
  student: Student = {
    studentId: 0,
    name: '',
    email: '',
    phone: '',
    course: null,
    totalFee: 0,
    paidFee: 0,
    balanceFee: 0
  };
  courses: Course[] = [];
  isEditMode = false;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadStudent(id);
    }
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Error fetching courses', err)
    });
  }

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (data) => this.student = data,
      error: (err) => console.error('Error fetching student', err)
    });
  }

  onCourseChange(): void {
    if (this.student.course) {
      // Find the full course object to get the fee
      const selectedCourse = this.courses.find(c => c.courseId == this.student.course?.courseId);
      if (selectedCourse) {
        this.student.course = selectedCourse;
        this.student.totalFee = selectedCourse.courseFee;
        this.calculateBalance();
      }
    }
  }

  calculateBalance(): void {
    this.student.balanceFee = (this.student.totalFee || 0) - (this.student.paidFee || 0);
  }

  saveStudent(): void {
    if (this.isEditMode) {
      this.studentService.updateStudent(this.student.studentId, this.student).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error updating student', err)
      });
    } else {
      this.studentService.saveStudent(this.student).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Error saving student', err)
      });
    }
  }

  compareCourses(o1: Course, o2: Course): boolean {
    return o1 && o2 ? o1.courseId === o2.courseId : o1 === o2;
  }
}
