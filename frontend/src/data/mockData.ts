export const salesData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
  { name: 'Aug', revenue: 4000, users: 2400 },
  { name: 'Sep', revenue: 3000, users: 1398 },
  { name: 'Oct', revenue: 2000, users: 9800 },
  { name: 'Nov', revenue: 2780, users: 3908 },
  { name: 'Dec', revenue: 3490, users: 4300 },
];

export const projectData = [
  { name: 'Q1', budget: 4000, spend: 2400 },
  { name: 'Q2', budget: 3000, spend: 1398 },
  { name: 'Q3', budget: 2000, spend: 9800 },
  { name: 'Q4', budget: 2780, spend: 3908 },
];

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  department: string;
};

export const transactionsData: UserRecord[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `USR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  name: ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince', 'Evan Wright'][i % 5] + ' ' + i,
  email: `user${i}@example.com`,
  role: ['Admin', 'Manager', 'Analyst', 'Viewer'][i % 4],
  status: ['Active', 'Inactive', 'Pending'][i % 3] as any,
  lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  department: ['Sales', 'Engineering', 'Marketing', 'HR'][Math.floor(Math.random() * 4)],
}));
