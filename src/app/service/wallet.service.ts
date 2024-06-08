// src/app/service/wallet.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  runTransaction,
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

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const studentDoc = await transaction.get(studentRef);

        if (!studentDoc.exists) {
          throw new Error('Student does not exist!');
        }

        const studentData = studentDoc.data() as Student;

        // Ensure wallet and transactions are initialized
        if (!studentData.wallet) {
          studentData.wallet = { transactions: [] };
        }
        if (!studentData.wallet.transactions) {
          studentData.wallet.transactions = [];
        }

        const currentBalance = studentData.balance || 0; // Ensure balance is a number
        const newBalance = currentBalance + amount;

        const newTransaction: Transaction = {
          date: new Date().toISOString(),
          amount: amount,
          description: description,
        };

        transaction.update(studentRef, {
          balance: newBalance,
          'wallet.transactions': [
            ...studentData.wallet.transactions,
            newTransaction,
          ],
        });
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

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const studentDoc = await transaction.get(studentRef);

        if (!studentDoc.exists) {
          throw new Error('Student does not exist!');
        }

        const studentData = studentDoc.data() as Student;

        // Ensure wallet and transactions are initialized
        if (!studentData.wallet) {
          studentData.wallet = { transactions: [] };
        }
        if (!studentData.wallet.transactions) {
          studentData.wallet.transactions = [];
        }

        const currentBalance = studentData.balance || 0; // Ensure balance is a number

        if (currentBalance < amount) {
          alert('Insufficient funds!'); // Prevent negative balance
        }

        const newBalance = currentBalance - amount;

        const newTransaction: Transaction = {
          date: new Date().toISOString(),
          amount: -amount, // Negative amount to indicate withdrawal in transaction
          description: description,
        };

        transaction.update(studentRef, {
          balance: newBalance,
          'wallet.transactions': [
            ...studentData.wallet.transactions,
            newTransaction,
          ],
        });
      })
    );
  }
}
