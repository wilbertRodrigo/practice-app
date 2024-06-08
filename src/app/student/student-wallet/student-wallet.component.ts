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
  amountToAdd: number = 0;

  constructor(private walletService: WalletService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && this.student) {
      // Ensure the wallet and transactions array are initialized
      this.student.wallet = this.student.wallet || { transactions: [] };
    }
  }

  showAddMoneyForm() {
    this.isAddingMoney = true;
  }

  hideAddMoneyForm() {
    this.isAddingMoney = false;
    this.amountToAdd = 0;
  }

  onAddMoney() {
    if (this.student && this.student.id && this.amountToAdd > 0) {
      const description = 'Added funds';

      this.walletService
        .addMoneyToWallet(this.student.id, this.amountToAdd, description)
        .subscribe(() => {
          if (this.student) {
            this.student.balance += this.amountToAdd;
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
    if (this.student && this.student.id) {
      console.log(`Withdrawing money from ${this.student.name}'s wallet`);
    }
  }

  isAddMoneyDisabled(): boolean {
    return this.amountToAdd === null || this.amountToAdd <= 0;
  }
}
