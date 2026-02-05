import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = 'http://localhost:8080/api/course';

    constructor(private http: HttpClient) { }

    getAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(this.apiUrl);
    }

    getCourseById(id: number): Observable<Course> {
        return this.http.get<Course>(`${this.apiUrl}/${id}`);
    }

    saveCourse(course: Course): Observable<Course> {
        return this.http.post<Course>(this.apiUrl, course);
    }

    updateCourse(id: number, course: Course): Observable<Course> {
        return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
    }

    deleteCourse(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }
}
