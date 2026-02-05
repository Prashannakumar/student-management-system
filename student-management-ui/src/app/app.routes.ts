import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseFormComponent } from './components/course-form/course-form.component';

export const routes: Routes = [
    { path: 'students', component: StudentListComponent },
    { path: 'students/add', component: StudentFormComponent },
    { path: 'students/edit/:id', component: StudentFormComponent },
    { path: 'courses', component: CourseListComponent },
    { path: 'courses/add', component: CourseFormComponent },
    { path: 'courses/edit/:id', component: CourseFormComponent },
    { path: '', redirectTo: '/students', pathMatch: 'full' }
];
