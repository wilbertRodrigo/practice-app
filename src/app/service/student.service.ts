// src/app/service/student.service.ts
import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  DocumentData,
  collectionData,
  addDoc,
  doc,
  DocumentReference,
  getDoc,
} from '@angular/fire/firestore';
import { Student } from '../model/student';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private studentsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.studentsCollection = collection(
      this.firestore,
      'students'
    ) as CollectionReference<DocumentData>;
  }

  // Getting all the students
  getAllStudents(): Observable<Student[]> {
    return collectionData(this.studentsCollection, {
      idField: 'id',
    }) as Observable<Student[]>;
  }

  // Adding a new student
  addNewStudent(student: Student) {
    const newStudent: Student = {
      ...student,
      balance: 0,
      wallet: {
        transactions: [],
      },
    };
    return addDoc(this.studentsCollection, newStudent);
  }

  // Getting a single student
  getStudent(studentId: string): Observable<Student> {
    const studentRef = doc(
      this.firestore,
      `students/${studentId}`
    ) as DocumentReference<Student>;
    return from(
      getDoc(studentRef).then((doc) => {
        if (doc.exists()) {
          const student = doc.data() as Student;
          // Ensure wallet.transactions is initialized
          if (!student.wallet) {
            student.wallet = { transactions: [] };
          }
          return { id: doc.id, ...student };
        } else {
          throw new Error('Student not found');
        }
      })
    );
  }
}
