/**
 * API Service for Production Management System
 * Automatically uses:
 * - JSON Server for local development (localhost)
 * - localStorage for GitHub Pages deployment
 */

import {
  initializeLocalDB,
  localUserAPI,
  localOrderAPI,
  localWorkOrderAPI,
  localActivityLogAPI,
} from './localStorageDB';

// API Configuration
const IS_PRODUCTION = import.meta.env.PROD;
const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const JSON_SERVER_URL = 'http://localhost:3001';

// Determine which backend to use
const USE_LOCAL_STORAGE = IS_PRODUCTION || !IS_LOCALHOST;

// Initialize localStorage DB if using it
if (USE_LOCAL_STORAGE) {
  console.log('🌐 Running on GitHub Pages - Using localStorage');
  initializeLocalDB();
} else {
  console.log('💻 Running on localhost - Using JSON Server');
}

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
  // If using localStorage, don't make HTTP requests
  if (USE_LOCAL_STORAGE) {
    throw new Error('localStorage mode - should not call fetchAPI');
  }

  try {
    const url = `${JSON_SERVER_URL}${endpoint}`;
    
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
    if (USE_LOCAL_STORAGE) return localUserAPI.getAll();
    return await fetchAPI('/users');
  },

  // Get user by username
  getByUsername: async (username: string): Promise<User | null> => {
    if (USE_LOCAL_STORAGE) return localUserAPI.getByUsername(username);
    const users = await fetchAPI(`/users?username=${username}`);
    return users[0] || null;
  },

  // Authenticate user
  authenticate: async (username: string, password: string): Promise<User | null> => {
    if (USE_LOCAL_STORAGE) return localUserAPI.authenticate(username, password);
    const users = await fetchAPI(`/users?username=${username}&password=${password}`);
    return users[0] || null;
  },

  // Create new user
  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    if (USE_LOCAL_STORAGE) return localUserAPI.create(user);
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
    if (USE_LOCAL_STORAGE) return localUserAPI.update(id, updates);
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
    if (USE_LOCAL_STORAGE) return localOrderAPI.getAll();
    return await fetchAPI('/productionOrders');
  },

  // Get order by ID
  getById: async (id: string): Promise<ProductionOrder | null> => {
    if (USE_LOCAL_STORAGE) return localOrderAPI.getById(id);
    try {
      return await fetchAPI(`/productionOrders/${id}`);
    } catch {
      return null;
    }
  },

  // Get orders by status
  getByStatus: async (status: string): Promise<ProductionOrder[]> => {
    if (USE_LOCAL_STORAGE) return localOrderAPI.getByStatus(status);
    return await fetchAPI(`/productionOrders?status=${status}`);
  },

  // Create new order
  create: async (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductionOrder> => {
    if (USE_LOCAL_STORAGE) return localOrderAPI.create(order);
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
    if (USE_LOCAL_STORAGE) return localOrderAPI.update(id, updates);
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
    if (USE_LOCAL_STORAGE) return localOrderAPI.delete(id);
    await fetchAPI(`/productionOrders/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─── Work Order APIs ──────────────────────────────────────────────────────────

export const workOrderAPI = {
  // Get all work orders
  getAll: async (): Promise<WorkOrder[]> => {
    if (USE_LOCAL_STORAGE) return localWorkOrderAPI.getAll();
    return await fetchAPI('/workOrders');
  },

  // Get work orders by order ID
  getByOrderId: async (orderId: string): Promise<WorkOrder[]> => {
    if (USE_LOCAL_STORAGE) return localWorkOrderAPI.getByOrderId(orderId);
    return await fetchAPI(`/workOrders?orderId=${orderId}`);
  },

  // Create work order
  create: async (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    if (USE_LOCAL_STORAGE) return localWorkOrderAPI.create(workOrder);
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
    if (USE_LOCAL_STORAGE) return localWorkOrderAPI.update(id, updates);
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
    if (USE_LOCAL_STORAGE) return localActivityLogAPI.getAll();
    return await fetchAPI('/activityLog');
  },

  // Get activity logs by order ID
  getByOrderId: async (orderId: string): Promise<ActivityLog[]> => {
    if (USE_LOCAL_STORAGE) return localActivityLogAPI.getByOrderId(orderId);
    return await fetchAPI(`/activityLog?orderId=${orderId}`);
  },

  // Create activity log
  create: async (log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> => {
    if (USE_LOCAL_STORAGE) return localActivityLogAPI.create(log);
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

// Export localStorage utilities for manual control
export { 
  initializeLocalDB, 
  resetLocalDB, 
  exportLocalDB, 
  importLocalDB 
} from './localStorageDB';

export default api;
