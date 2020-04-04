import { EntityState } from '@ngrx/entity';
import {getState} from '../accounting.state';

export class Budget {
  public Id: number;
  public UserId: number;
  CategoryId: number;
  Name: string;
  CurrencyId: number;
  GoalAmount: number;
  RealAmount: number;
  StartDate: Date;
  EndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  category: {
    category: string;
  };
  currency: {
    sign: string;
  };

  updateFromForm(form) {
    this.Name = form.budgetName;
    this.StartDate = form.startDate;
    this.EndDate = form.endDate;
    this.GoalAmount = form.goal;
    this.CurrencyId = form.currency.id;
    this.CategoryId = form.category.id;
  }
}

export interface BudgetState extends EntityState<Budget> {}
