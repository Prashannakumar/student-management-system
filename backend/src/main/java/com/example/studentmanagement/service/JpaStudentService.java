package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JpaStudentService implements StudentService {

    @Autowired
    public StudentRepository repository;

    @Override
    public Student saveStudent(Student student) {
        student.setBalanceFee(student.getTotalFee()-student.getPaidFee());
        return repository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    @Override
    public Student getStudentById(int id) {
        return repository.findById(id).orElseThrow();
    }

    @Override
    public Student updateStudentById(int id, Student student) {
        Student existing = getStudentById(id);

        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setPhone(student.getPhone());
        existing.setCourse(student.getCourse());
        existing.setTotalFee(student.getTotalFee());
        existing.setPaidFee(student.getPaidFee());
        existing.setBalanceFee(student.getTotalFee() - student.getPaidFee());

        return repository.save(existing);
    }

    @Override
    public void deleteStudentById(int id) {
        repository.deleteById(id);
    }
}
