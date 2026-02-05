package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;

import java.util.List;

public interface StudentService {
    Student saveStudent(Student student);
    List<Student> getAllStudents();
    Student getStudentById(int id);
    Student updateStudentById(int id, Student student);
    void deleteStudentById(int id);
}
