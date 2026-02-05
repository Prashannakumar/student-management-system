package com.example.studentmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "student")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private int studentId;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    @Column(name = "total_fee")
    private Double totalFee;

    @Column(name = "paid_fee")
    private Double paidFee;

    @Column(name = "balance_fee")
    private Double balanceFee;
}
