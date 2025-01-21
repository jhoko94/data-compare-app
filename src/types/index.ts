// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
}

// Loss related types
export interface Loss {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
  reportedBy: string;
}

// Case related types
export interface Case {
  id: string;
  title: string;
  description: string;
  lossId: string;
  status: 'open' | 'in_progress' | 'closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// Return related types
export interface Return {
  id: string;
  caseId: string;
  amount: number;
  date: string;
  method: 'cash' | 'transfer' | 'assets';
  status: 'pending' | 'completed';
  notes?: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}