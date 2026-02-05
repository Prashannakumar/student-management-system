package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/course")
public class CourseController {
    @Autowired
    private CourseService service;

    @PostMapping
    public Course saveCourse(@RequestBody Course course){
        return service.saveCourse(course);
    }

    @GetMapping
    public List<Course> getAllCourse(){
        return service.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable int id){
        return service.getCourseById(id);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable int id, @RequestBody Course course){
        return service.updateCourseById(id, course);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable int id){
        service.deleteCourseById(id);
        return "Course deleted successfully!";
    }
}
