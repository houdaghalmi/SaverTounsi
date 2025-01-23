export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    type: 'income' | 'expense';
    category: TransactionCategory;
    description: string;
    date: Date;
    paymentMethod: PaymentMethod;
    attachments?: string[];
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TransactionCategory {
    id: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
  }
  
  export interface PaymentMethod {
    id: string;
    name: string;
    type: 'cash' | 'card' | 'bank' | 'mobile';
    lastFour?: string;
    icon: string;
  }