// src/app/components/student-wallet/student-wallet.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Student } from '../../model/student';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-student-wallet',
  templateUrl: './student-wallet.component.html',
  styleUrls: ['./student-wallet.component.css'],
})
export class StudentWalletComponent implements OnChanges {
  @Input() student: Student | undefined;
  isAddingMoney: boolean = false;
  isWithdrawingMoney: boolean = false;
  amountToAdd: number = 0;
  amountToWithdraw: number = 0;

  constructor(private walletService: WalletService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && this.student) {
      // Ensure the wallet and transactions array are initialized
      if (!this.student.wallet) {
        this.student.wallet = { transactions: [] };
      }
      if (!this.student.wallet.transactions) {
        this.student.wallet.transactions = [];
      }
      this.student.balance = this.student.balance || 0; // Ensure balance is a number
    }
  }

  showAddMoneyForm() {
    this.isAddingMoney = true;
    this.isWithdrawingMoney = false;
  }

  hideAddMoneyForm() {
    this.isAddingMoney = false;
    this.amountToAdd = 0;
  }

  showWithdrawMoneyForm() {
    this.isWithdrawingMoney = true;
    this.isAddingMoney = false;
  }

  hideWithdrawMoneyForm() {
    this.isWithdrawingMoney = false;
    this.amountToWithdraw = 0;
  }

  onAddMoney() {
    if (this.student && this.student.id && this.amountToAdd > 0) {
      const description = 'Added funds';

      this.walletService
        .addMoneyToWallet(this.student.id, this.amountToAdd, description)
        .subscribe(() => {
          if (this.student) {
            this.student.balance =
              (this.student.balance || 0) + this.amountToAdd;
            this.student.wallet.transactions.push({
              date: new Date().toISOString(),
              amount: this.amountToAdd,
              description: description,
            });
            console.log(
              `Added money to ${this.student.name}'s wallet`,
              this.student.balance
            );
            this.hideAddMoneyForm();
          }
        });
    }
  }

  onWithdrawMoney() {
    if (this.student && this.student.id && this.amountToWithdraw > 0) {
      const description = 'Withdrawn funds';

      this.walletService
        .withdrawMoneyFromWallet(
          this.student.id,
          this.amountToWithdraw,
          description
        )
        .subscribe(() => {
          if (this.student) {
            this.student.balance =
              (this.student.balance || 0) - this.amountToWithdraw;
            this.student.wallet.transactions.push({
              date: new Date().toISOString(),
              amount: -this.amountToWithdraw,
              description: description,
            });
            console.log(
              `Withdrew money from ${this.student.name}'s wallet`,
              this.student.balance
            );
            this.hideWithdrawMoneyForm();
          }
        });
    }
  }

  isAddMoneyDisabled(): boolean {
    return this.amountToAdd === null || this.amountToAdd <= 0;
  }

  isWithdrawMoneyDisabled(): any {
    return (
      this.amountToWithdraw === null ||
      this.amountToWithdraw <= 0 ||
      (this.student && this.amountToWithdraw > this.student.balance)
    );
  }
}
