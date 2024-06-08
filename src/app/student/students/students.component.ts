import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students$: Observable<Student[]> | undefined;
  selectedStudent: Student | undefined;
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getStudents();
  }

  //getting all the students
  getStudents() {
    this.students$ = this.studentService.getAllStudents();
  }

  onSelectedStudent(student: Student) {
    this.selectedStudent = student;
  }
}
