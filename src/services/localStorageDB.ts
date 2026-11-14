/**
 * localStorage Database Service
 * Fallback for GitHub Pages deployment when JSON Server is not available
 */

import type { 
  User, 
  ProductionOrder, 
  WorkOrder, 
  ActivityLog 
} from './api';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'pms_users',
  ORDERS: 'pms_orders',
  WORK_ORDERS: 'pms_work_orders',
  ACTIVITY_LOG: 'pms_activity_log',
  INITIALIZED: 'pms_db_initialized',
};

// Initial data (same as db.json)
const INITIAL_DATA = {
  users: [
    {
      id: 'u1',
      username: 'po_manager',
      password: 'Manager@2024',
      email: 'manager@production.com',
      displayName: 'PO Manager',
      displayNameAr: 'مدير الأوردرات',
      role: 'po_manager',
      avatarInitials: 'PM',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u2',
      username: 'planner',
      password: 'Planner@2024',
      email: 'planner@production.com',
      displayName: 'Planner',
      displayNameAr: 'المخطط',
      role: 'planner',
      avatarInitials: 'PL',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u3',
      username: 'cutting',
      password: 'Cutting@2024',
      email: 'cutting@production.com',
      displayName: 'Cutting Supervisor',
      displayNameAr: 'مشرف القص',
      role: 'cutting',
      avatarInitials: 'CU',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u4',
      username: 'sewing',
      password: 'Sewing@2024',
      email: 'sewing@production.com',
      displayName: 'Sewing Supervisor',
      displayNameAr: 'مشرف الخياطة',
      role: 'sewing',
      avatarInitials: 'SW',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u5',
      username: 'ironing',
      password: 'Ironing@2024',
      email: 'ironing@production.com',
      displayName: 'Ironing Supervisor',
      displayNameAr: 'مشرف المكوى',
      role: 'ironing',
      avatarInitials: 'IR',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u6',
      username: 'packing',
      password: 'Packing@2024',
      email: 'packing@production.com',
      displayName: 'Packing Supervisor',
      displayNameAr: 'مشرف التعبئة',
      role: 'packing',
      avatarInitials: 'PK',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'u7',
      username: 'admin',
      password: 'Admin@2024#Secure',
      email: 'admin@production.com',
      displayName: 'System Admin',
      displayNameAr: 'مدير النظام',
      role: 'po_manager',
      avatarInitials: 'AD',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  productionOrders: [
    {
      id: 'PO-2024-001',
      poNumber: 'PO-2024-001',
      customerStyle: 'STYLE-A-100',
      factoryStyle: 'FAC-A-100',
      client: 'Zara',
      category: 'T-Shirt',
      fabric: 'Cotton 100%',
      season: 'Summer 2024',
      destination: 'Spain',
      deliveryDate: '2024-12-31',
      orderDate: '2024-11-01',
      status: 'in_progress',
      colors: [
        {
          id: 'c1',
          name: 'Navy Blue',
          hex: '#001f3f',
          sizes: { S: 100, M: 150, L: 120, XL: 80 },
        },
        {
          id: 'c2',
          name: 'White',
          hex: '#FFFFFF',
          sizes: { S: 80, M: 120, L: 100, XL: 70 },
        },
      ],
      totalQuantity: 820,
      stages: {
        marker: {
          status: 'done',
          completedDate: '2024-11-05',
          completedBy: 'u2',
        },
        consumption: {
          status: 'done',
          completedDate: '2024-11-06',
          completedBy: 'u2',
        },
        cutting: {
          status: 'in_progress',
          progress: 65,
          startedDate: '2024-11-07',
          assignedTo: 'u3',
        },
        sewing: { status: 'pending' },
        ironing: { status: 'pending' },
        packing: { status: 'pending' },
      },
      createdAt: '2024-11-01T10:00:00.000Z',
      updatedAt: '2024-11-14T15:30:00.000Z',
    },
    {
      id: 'PO-2024-002',
      poNumber: 'PO-2024-002',
      customerStyle: 'STYLE-B-200',
      factoryStyle: 'FAC-B-200',
      client: 'H&M',
      category: 'Jeans',
      fabric: 'Denim',
      season: 'Fall 2024',
      destination: 'Sweden',
      deliveryDate: '2024-12-15',
      orderDate: '2024-10-20',
      status: 'pending',
      colors: [
        {
          id: 'c3',
          name: 'Dark Blue',
          hex: '#00008B',
          sizes: { '28': 50, '30': 100, '32': 120, '34': 80, '36': 50 },
        },
      ],
      totalQuantity: 400,
      stages: {
        marker: { status: 'pending' },
        consumption: { status: 'pending' },
        cutting: { status: 'pending' },
        sewing: { status: 'pending' },
        ironing: { status: 'pending' },
        packing: { status: 'pending' },
      },
      createdAt: '2024-10-20T09:00:00.000Z',
      updatedAt: '2024-10-20T09:00:00.000Z',
    },
  ],
  workOrders: [
    {
      id: 'WO-001',
      orderId: 'PO-2024-001',
      type: 'cutting',
      assignedTo: 'u3',
      status: 'in_progress',
      progress: 65,
      notes: 'Cut carefully according to marker',
      createdAt: '2024-11-07T08:00:00.000Z',
      updatedAt: '2024-11-14T16:00:00.000Z',
    },
  ],
  activityLog: [
    {
      id: 'log-001',
      orderId: 'PO-2024-001',
      userId: 'u2',
      action: 'order_created',
      description: 'Order created',
      timestamp: '2024-11-01T10:00:00.000Z',
    },
    {
      id: 'log-002',
      orderId: 'PO-2024-001',
      userId: 'u2',
      action: 'stage_completed',
      stage: 'marker',
      description: 'Marker stage completed',
      timestamp: '2024-11-05T14:30:00.000Z',
    },
    {
      id: 'log-003',
      orderId: 'PO-2024-001',
      userId: 'u3',
      action: 'stage_started',
      stage: 'cutting',
      description: 'Cutting stage started',
      timestamp: '2024-11-07T08:00:00.000Z',
    },
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// Initialize database with default data if first time
export function initializeLocalDB(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    console.log('🔧 Initializing localStorage database...');
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_DATA.users);
    saveToStorage(STORAGE_KEYS.ORDERS, INITIAL_DATA.productionOrders);
    saveToStorage(STORAGE_KEYS.WORK_ORDERS, INITIAL_DATA.workOrders);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, INITIAL_DATA.activityLog);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('✅ localStorage database initialized!');
  }
}

// Reset database to initial state
export function resetLocalDB(): void {
  console.log('🔄 Resetting localStorage database...');
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  initializeLocalDB();
  console.log('✅ Database reset complete!');
}

// Export data (for backup)
export function exportLocalDB() {
  return {
    users: getFromStorage<User>(STORAGE_KEYS.USERS),
    productionOrders: getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS),
    workOrders: getFromStorage<WorkOrder>(STORAGE_KEYS.WORK_ORDERS),
    activityLog: getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOG),
  };
}

// Import data (from backup)
export function importLocalDB(data: ReturnType<typeof exportLocalDB>): void {
  saveToStorage(STORAGE_KEYS.USERS, data.users);
  saveToStorage(STORAGE_KEYS.ORDERS, data.productionOrders);
  saveToStorage(STORAGE_KEYS.WORK_ORDERS, data.workOrders);
  saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, data.activityLog);
  console.log('✅ Database imported successfully!');
}

// ─── User APIs ────────────────────────────────────────────────────────────────

export const localUserAPI = {
  getAll: async (): Promise<User[]> => {
    return getFromStorage<User>(STORAGE_KEYS.USERS);
  },

  getByUsername: async (username: string): Promise<User | null> => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find((u) => u.username === username) || null;
  },

  authenticate: async (username: string, password: string): Promise<User | null> => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find((u) => u.username === username && u.password === password) || null;
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const newUser: User = {
      ...user,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as User;
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return users[index];
  },
};

// ─── Production Order APIs ────────────────────────────────────────────────────

export const localOrderAPI = {
  getAll: async (): Promise<ProductionOrder[]> => {
    return getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
  },

  getById: async (id: string): Promise<ProductionOrder | null> => {
    const orders = getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
    return orders.find((o) => o.id === id) || null;
  },

  getByStatus: async (status: string): Promise<ProductionOrder[]> => {
    const orders = getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
    return orders.filter((o) => o.status === status);
  },

  create: async (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductionOrder> => {
    const orders = getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
    const newOrder: ProductionOrder = {
      ...order,
      id: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ProductionOrder;
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  update: async (id: string, updates: Partial<ProductionOrder>): Promise<ProductionOrder> => {
    const orders = getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    orders[index] = { 
      ...orders[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  delete: async (id: string): Promise<void> => {
    const orders = getFromStorage<ProductionOrder>(STORAGE_KEYS.ORDERS);
    const filtered = orders.filter((o) => o.id !== id);
    saveToStorage(STORAGE_KEYS.ORDERS, filtered);
  },
};

// ─── Work Order APIs ──────────────────────────────────────────────────────────

export const localWorkOrderAPI = {
  getAll: async (): Promise<WorkOrder[]> => {
    return getFromStorage<WorkOrder>(STORAGE_KEYS.WORK_ORDERS);
  },

  getByOrderId: async (orderId: string): Promise<WorkOrder[]> => {
    const workOrders = getFromStorage<WorkOrder>(STORAGE_KEYS.WORK_ORDERS);
    return workOrders.filter((wo) => wo.orderId === orderId);
  },

  create: async (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    const workOrders = getFromStorage<WorkOrder>(STORAGE_KEYS.WORK_ORDERS);
    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: `WO-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as WorkOrder;
    workOrders.push(newWorkOrder);
    saveToStorage(STORAGE_KEYS.WORK_ORDERS, workOrders);
    return newWorkOrder;
  },

  update: async (id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
    const workOrders = getFromStorage<WorkOrder>(STORAGE_KEYS.WORK_ORDERS);
    const index = workOrders.findIndex((wo) => wo.id === id);
    if (index === -1) throw new Error('Work order not found');
    
    workOrders[index] = {
      ...workOrders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.WORK_ORDERS, workOrders);
    return workOrders[index];
  },
};

// ─── Activity Log APIs ────────────────────────────────────────────────────────

export const localActivityLogAPI = {
  getAll: async (): Promise<ActivityLog[]> => {
    return getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOG);
  },

  getByOrderId: async (orderId: string): Promise<ActivityLog[]> => {
    const logs = getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOG);
    return logs.filter((log) => log.orderId === orderId);
  },

  create: async (log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> => {
    const logs = getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOG);
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    } as ActivityLog;
    logs.push(newLog);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, logs);
    return newLog;
  },
};
