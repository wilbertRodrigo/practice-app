import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from 'src/app/service/student.service';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent {
  studentForm!: FormGroup;
  newStudent: any;

  constructor(private studentService: StudentService, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  //adding a new student
  onSubmit() {
    if (this.studentForm.valid) {
      this.newStudent = this.studentForm.value;
      this.studentService
        .addNewStudent(this.newStudent)
        .then(() => {
          console.log('Student added successfully', this.newStudent);
          this.studentForm.reset();
        })
        .catch((error) => {
          console.error('Error adding student: ', error);
        });
    }
  }
}
