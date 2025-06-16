export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  avatar: string;
  friends: number[];
  createdAt: Date;
}

export const DEMO_USERS: User[] = [
  {
    id: 1,
    username: "arnav",
    password: "demo123",
    name: "Arnav Nigga",
    avatar: "/avatars/arnav.jpg",
    // avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    friends: [2, 3],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    username: "divya",
    password: "demo123", 
    name: "Divya",
    avatar: "/avatars/divya.jpg",
    // avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=100&h=100&fit=crop&crop=face",
    friends: [1],
    createdAt: new Date('2024-01-02')
  },
  {
    id: 3,
    username: "demo",
    password: "demo123",
    name: "Demo User",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    friends: [1],
    createdAt: new Date('2024-01-03')
  }
];

export const findUserByCredentials = (username: string, password: string): User | null => {
  return DEMO_USERS.find(user => 
    user.username === username && user.password === password
  ) || null;
};

export const findUserById = (id: number): User | null => {
  return DEMO_USERS.find(user => user.id === id) || null;
};