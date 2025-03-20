
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear?: number;
  publisher?: string;
  genre: string;
  description: string;
  coverImage?: string;
  pageCount?: number;
  language?: string;
  available: boolean;
  availableCopies: number;
  totalCopies: number;
  location?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isEbook?: boolean;
  ebookFormats?: string[];
  ebookPath?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  membershipId: string;
  createdAt: string;
  status: 'active' | 'pending' | 'expired' | 'suspended';
  subscriptionType: 'free' | 'basic' | 'premium';
  notes?: string;
}

export interface BookLoan {
  id: string;
  memberId: string;
  bookId: string;
  bookTitle: string; // Denormalized for convenience
  copyId?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  returned: boolean;
  renewalCount: number;
  notes?: string;
}

export interface MemberWithLoans extends Member {
  loans: BookLoan[];
}

export interface BookCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface BookPublisher {
  id: string;
  name: string;
  contact?: string;
  website?: string;
}

export interface BookAuthor {
  id: string;
  name: string;
  biography?: string;
  photo?: string;
}

export interface LibrarySettings {
  id: string;
  maxLoanDuration: {
    free: number;
    basic: number;
    premium: number;
  };
  maxLoansCount: {
    free: number;
    basic: number;
    premium: number;
  };
  finePerDay: number;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
}

export interface LibraryStats {
  id: string;
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  popularBooks: {
    bookId: string;
    title: string;
    loanCount: number;
  }[];
  topCategories: {
    categoryId: string;
    name: string;
    bookCount: number;
  }[];
  lastUpdated: string;
}
