// src/app/service/wallet.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  arrayUnion,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Student } from '../model/student';
import { Transaction } from '../model/transaction';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private firestore: Firestore) {}

  addMoneyToWallet(
    studentId: string,
    amount: number,
    description: string
  ): Observable<void> {
    const studentRef = doc(
      this.firestore,
      `students/${studentId}`
    ) as DocumentReference<Student>;

    const transaction: Transaction = {
      date: new Date().toISOString(),
      amount: amount,
      description: description,
    };

    return from(
      updateDoc(studentRef, {
        balance: amount, // assuming balance is updated with rules or by summing transactions
        'wallet.transactions': arrayUnion(transaction),
      })
    );
  }

  withdrawMoneyFromWallet(
    studentId: string,
    amount: number,
    description: string
  ): Observable<void> {
    const studentRef = doc(
      this.firestore,
      `students/${studentId}`
    ) as DocumentReference<Student>;

    const transaction: Transaction = {
      date: new Date().toISOString(),
      amount: -amount, // Negative amount to indicate withdrawal
      description: description,
    };

    return from(
      updateDoc(studentRef, {
        balance: amount, // assuming balance is updated with rules or by summing transactions
        'wallet.transactions': arrayUnion(transaction),
      })
    );
  }
}
