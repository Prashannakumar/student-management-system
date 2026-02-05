package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Course;

import java.util.List;

public interface CourseService {
    Course saveCourse(Course course);
    List<Course> getAllCourses();
    Course getCourseById(int id);
    Course updateCourseById(int id, Course course);
    void deleteCourseById(int id);
}
