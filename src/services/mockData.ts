import type { User } from "../types/user";
import type { Ticket } from "../types/ticket";
import type { Category } from "../types/category";
import type { Comment } from "../types/comment";

export const initialUsers: User[] = [
  {
    id: "U01",
    name: "Admin User",
    email: "admin@gmail.com",
    password: "123456",
    phone: "9876543210",
    department: "IT",
    role: "admin",
    status: "active",
    createdDate: "2026-09-01",
  },
  {
    id: "U02",
    name: "Support Agent",
    email: "agent@gmail.com",
    password: "123456",
    phone: "9876543211",
    department: "Support",
    role: "support_agent",
    status: "active",
    createdDate: "2026-09-01",
  },
  {
    id: "U03",
    name: "Employee User",
    email: "employee@gmail.com",
    password: "123456",
    phone: "9876543212",
    department: "HR",
    role: "employee",
    status: "active",
    createdDate: "2026-09-02",
  },
  {
    id: "U04",
    name: "Swathi Candidate",
    email: "swathi@gmail.com",
    password: "123456",
    phone: "9876543213",
    department: "Development",
    role: "employee",
    status: "active",
    createdDate: "2026-09-02",
  },
  {
    id: "U05",
    name: "Inactive User",
    email: "inactive@gmail.com",
    password: "123456",
    phone: "9876543214",
    department: "Finance",
    role: "employee",
    status: "inactive",
    createdDate: "2026-09-03",
  },
];

export const initialTickets: Ticket[] = [
  {
    id: "T01",
    subject: "Unable to login",
    description: "User is unable to login to the company portal.",
    createdBy: "U03",
    assignedAgent: "U02",
    category: "Access Management",
    priority: "high",
    status: "in_progress",
    createdDate: "2026-09-05",
    updatedDate: "2026-09-06",
    dueDate: "2026-09-08",
    preferredContactMethod: "email",
    resolution: "",
    resolutionNotes: "",
    resolutionDate: null,
  },
  {
    id: "T02",
    subject: "Laptop is not working",
    description: "The employee laptop is not turning on.",
    createdBy: "U04",
    assignedAgent: "U02",
    category: "Hardware",
    priority: "critical",
    status: "assigned",
    createdDate: "2026-09-04",
    updatedDate: "2026-09-04",
    dueDate: "2026-09-07",
    preferredContactMethod: "phone",
    resolution: "",
    resolutionNotes: "",
    resolutionDate: null,
  },
  {
    id: "T03",
    subject: "Software installation request",
    description: "Request to install Visual Studio Code.",
    createdBy: "U03",
    assignedAgent: null,
    category: "Software",
    priority: "medium",
    status: "open",
    createdDate: "2026-09-03",
    updatedDate: "2026-09-03",
    dueDate: "2026-09-10",
    preferredContactMethod: "chat",
    resolution: "",
    resolutionNotes: "",
    resolutionDate: null,
  },
  {
    id: "T04",
    subject: "Internet connection issue",
    description: "Internet connection is frequently disconnecting.",
    createdBy: "U04",
    assignedAgent: "U02",
    category: "Network",
    priority: "high",
    status: "resolved",
    createdDate: "2026-09-01",
    updatedDate: "2026-09-02",
    dueDate: "2026-09-04",
    preferredContactMethod: "email",
    resolution: "Network cable replaced",
    resolutionNotes: "The damaged network cable was replaced successfully.",
    resolutionDate: "2026-09-02",
  },
  {
    id: "T05",
    subject: "Email access request",
    description: "User needs access to the official email account.",
    createdBy: "U03",
    assignedAgent: "U02",
    category: "Email",
    priority: "low",
    status: "closed",
    createdDate: "2026-08-30",
    updatedDate: "2026-09-01",
    dueDate: "2026-09-03",
    preferredContactMethod: "email",
    resolution: "Email account activated",
    resolutionNotes: "Email access was provided to the employee.",
    resolutionDate: "2026-09-01",
  },
];

export const initialCategories: Category[] = [
  {
    id: "CAT01",
    name: "Hardware",
    description: "Laptop, desktop, printer and other hardware issues",
    status: "active",
  },
  {
    id: "CAT02",
    name: "Software",
    description: "Software installation and application issues",
    status: "active",
  },
  {
    id: "CAT03",
    name: "Network",
    description: "Internet, Wi-Fi and network connectivity issues",
    status: "active",
  },
  {
    id: "CAT04",
    name: "Email",
    description: "Official email account related issues",
    status: "active",
  },
  {
    id: "CAT05",
    name: "Security",
    description: "Security incidents, virus alerts and access security",
    status: "active",
  },
  {
    id: "CAT06",
    name: "Access Request",
    description: "Login, password and access permission issues",
    status: "active",
  },
  {
    id: "CAT07",
    name: "Other",
    description: "Other service desk requests",
    status: "active",
  },
];

export const initialComments: Comment[] = [
  {
    id: "C01",
    ticketId: "T01",
    userId: "U02",
    comment: "We are checking the login issue.",
    createdDate: "2026-09-06",
    createdTime: "10:30 AM",
  },
  {
    id: "C02",
    ticketId: "T01",
    userId: "U03",
    comment: "Thank you. I am waiting for the update.",
    createdDate: "2026-09-06",
    createdTime: "11:00 AM",
  },
  {
    id: "C03",
    ticketId: "T04",
    userId: "U02",
    comment: "The network cable was replaced.",
    createdDate: "2026-09-02",
    createdTime: "04:00 PM",
  },
];

// Helper functions to get/set fallback data in localStorage
export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem("service_desk_users");
  if (!data) {
    localStorage.setItem("service_desk_users", JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialUsers;
  }
};

export const setStoredUsers = (users: User[]) => {
  localStorage.setItem("service_desk_users", JSON.stringify(users));
};

export const getStoredTickets = (): Ticket[] => {
  const data = localStorage.getItem("service_desk_tickets");
  if (!data) {
    localStorage.setItem("service_desk_tickets", JSON.stringify(initialTickets));
    return initialTickets;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialTickets;
  }
};

export const setStoredTickets = (tickets: Ticket[]) => {
  localStorage.setItem("service_desk_tickets", JSON.stringify(tickets));
};

export const getStoredCategories = (): Category[] => {
  const data = localStorage.getItem("service_desk_categories");
  if (!data) {
    localStorage.setItem("service_desk_categories", JSON.stringify(initialCategories));
    return initialCategories;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialCategories;
  }
};

export const setStoredCategories = (categories: Category[]) => {
  localStorage.setItem("service_desk_categories", JSON.stringify(categories));
};

export const getStoredComments = (): Comment[] => {
  const data = localStorage.getItem("service_desk_comments");
  if (!data) {
    localStorage.setItem("service_desk_comments", JSON.stringify(initialComments));
    return initialComments;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialComments;
  }
};

export const setStoredComments = (comments: Comment[]) => {
  localStorage.setItem("service_desk_comments", JSON.stringify(comments));
};
