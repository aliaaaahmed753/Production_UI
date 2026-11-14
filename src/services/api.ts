/**
 * API Service for Production Management System
 * Handles all API calls to JSON Server or GitHub API
 */

// API Configuration
const IS_PRODUCTION = import.meta.env.PROD;
const JSON_SERVER_URL = 'http://localhost:3001';
const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/db.json';

// Use JSON Server for development, GitHub API for production
const API_BASE_URL = IS_PRODUCTION ? GITHUB_API_URL : JSON_SERVER_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  displayName: string;
  displayNameAr: string;
  role: string;
  avatarInitials: string;
  createdAt: string;
}

export interface ProductionOrder {
  id: string;
  poNumber: string;
  customerStyle: string;
  factoryStyle: string;
  client: string;
  category: string;
  fabric: string;
  season: string;
  destination: string;
  deliveryDate: string;
  orderDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  colors: OrderColor[];
  totalQuantity: number;
  stages: OrderStages;
  createdAt: string;
  updatedAt: string;
}

export interface OrderColor {
  id: string;
  name: string;
  hex: string;
  sizes: Record<string, number>;
}

export interface OrderStages {
  marker: StageStatus;
  consumption: StageStatus;
  cutting: StageStatus;
  sewing: StageStatus;
  ironing: StageStatus;
  packing: StageStatus;
}

export interface StageStatus {
  status: 'pending' | 'in_progress' | 'done';
  progress?: number;
  startedDate?: string;
  completedDate?: string;
  assignedTo?: string;
  completedBy?: string;
}

export interface WorkOrder {
  id: string;
  orderId: string;
  type: string;
  assignedTo: string;
  status: string;
  progress: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  orderId: string;
  userId: string;
  action: string;
  stage?: string;
  description: string;
  timestamp: string;
}

// ─── API Helper Functions ─────────────────────────────────────────────────────

async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const url = IS_PRODUCTION 
      ? API_BASE_URL 
      : `${JSON_SERVER_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ─── User APIs ────────────────────────────────────────────────────────────────

export const userAPI = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    return await fetchAPI('/users');
  },

  // Get user by username
  getByUsername: async (username: string): Promise<User | null> => {
    const users = await fetchAPI(`/users?username=${username}`);
    return users[0] || null;
  },

  // Authenticate user
  authenticate: async (username: string, password: string): Promise<User | null> => {
    const users = await fetchAPI(`/users?username=${username}&password=${password}`);
    return users[0] || null;
  },

  // Create new user
  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser = {
      ...user,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return await fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
  },

  // Update user
  update: async (id: string, updates: Partial<User>): Promise<User> => {
    return await fetchAPI(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

// ─── Production Order APIs ────────────────────────────────────────────────────

export const orderAPI = {
  // Get all orders
  getAll: async (): Promise<ProductionOrder[]> => {
    return await fetchAPI('/productionOrders');
  },

  // Get order by ID
  getById: async (id: string): Promise<ProductionOrder | null> => {
    try {
      return await fetchAPI(`/productionOrders/${id}`);
    } catch {
      return null;
    }
  },

  // Get orders by status
  getByStatus: async (status: string): Promise<ProductionOrder[]> => {
    return await fetchAPI(`/productionOrders?status=${status}`);
  },

  // Create new order
  create: async (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductionOrder> => {
    const newOrder = {
      ...order,
      id: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await fetchAPI('/productionOrders', {
      method: 'POST',
      body: JSON.stringify(newOrder),
    });
  },

  // Update order
  update: async (id: string, updates: Partial<ProductionOrder>): Promise<ProductionOrder> => {
    const updatedOrder = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return await fetchAPI(`/productionOrders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedOrder),
    });
  },

  // Delete order
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/productionOrders/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─── Work Order APIs ──────────────────────────────────────────────────────────

export const workOrderAPI = {
  // Get all work orders
  getAll: async (): Promise<WorkOrder[]> => {
    return await fetchAPI('/workOrders');
  },

  // Get work orders by order ID
  getByOrderId: async (orderId: string): Promise<WorkOrder[]> => {
    return await fetchAPI(`/workOrders?orderId=${orderId}`);
  },

  // Create work order
  create: async (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    const newWorkOrder = {
      ...workOrder,
      id: `WO-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await fetchAPI('/workOrders', {
      method: 'POST',
      body: JSON.stringify(newWorkOrder),
    });
  },

  // Update work order
  update: async (id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
    const updatedWorkOrder = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return await fetchAPI(`/workOrders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedWorkOrder),
    });
  },
};

// ─── Activity Log APIs ────────────────────────────────────────────────────────

export const activityLogAPI = {
  // Get all activity logs
  getAll: async (): Promise<ActivityLog[]> => {
    return await fetchAPI('/activityLog');
  },

  // Get activity logs by order ID
  getByOrderId: async (orderId: string): Promise<ActivityLog[]> => {
    return await fetchAPI(`/activityLog?orderId=${orderId}`);
  },

  // Create activity log
  create: async (log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> => {
    const newLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    return await fetchAPI('/activityLog', {
      method: 'POST',
      body: JSON.stringify(newLog),
    });
  },
};

// ─── Export all APIs ──────────────────────────────────────────────────────────

export const api = {
  users: userAPI,
  orders: orderAPI,
  workOrders: workOrderAPI,
  activityLog: activityLogAPI,
};

export default api;
