package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JpaCourseService implements CourseService {

    @Autowired
    private CourseRepository repository;

    @Override
    public Course saveCourse(Course course){
        return repository.save(course);
    }

    @Override
    public List<Course> getAllCourses(){
        return repository.findAll();
    }

    @Override
    public Course getCourseById(int id){
        return repository.findById(id).orElseThrow();
    }

    @Override
    public Course updateCourseById(int id, Course course){
        Course existing = getCourseById(id);
        existing.setCourseName(course.getCourseName());
        existing.setCourseFee(course.getCourseFee());
        existing.setDuration(course.getDuration());
        return repository.save(existing);
    }

    @Override
    public void deleteCourseById(int id){
        repository.deleteById(id);
    }

}
