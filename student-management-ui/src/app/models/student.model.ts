import { Course } from "./course.model";

export interface Student {
    studentId: number;
    name: string;
    email: string;
    phone: string;
    course: Course | null;
    totalFee: number;
    paidFee: number;
    balanceFee: number;
}
