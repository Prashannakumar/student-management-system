package com.example.studentmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private int courseId;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "duration")
    private String duration;

    @Column(name = "course_fee")
    private double courseFee;

    public int getCourseId() {
        return courseId;
    }

    public String getCourseName(){
        return this.courseName;
    }

    public String getDuration(){
        return this.duration;
    }
    public double getCourseFee(){
        return courseFee;
    }

    public void setCourseId(int courseId){ this.courseId = courseId;}
    public void setCourseName(String courseName){
        this.courseName = courseName;
    }
    public void setDuration(String duration){
        this.duration = duration;
    }
    public void setCourseFee(double courseFee){
        this.courseFee = courseFee;
    }
}
