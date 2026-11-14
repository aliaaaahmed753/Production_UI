/**
 * Initialize IndexedDB with sample production orders
 * This runs once on first load to populate the database
 */

import type { WorkOrder } from '../types/workOrder';
import { dbGetAll, dbWrite } from './localDb';

const INIT_KEY = 'pms_db_initialized_v1';

// Sample work orders (converted from production orders)
const SAMPLE_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-2024-001',
    workOrderNumber: 'WO-2024-001',
    client: 'Zara',
    garmentType: 'T-Shirt',
    modelName: 'STYLE-A-100',
    clientStyle: 'STYLE-A-100',
    ourStyle: 'FAC-A-100',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'c1',
        name: 'Navy Blue',
        ratio: { S: 1, M: 1, L: 1, XL: 1 },
        orderQuantity: 450,
        extraPercent: 5,
      },
      {
        id: 'c2',
        name: 'White',
        ratio: { S: 1, M: 1, L: 1, XL: 1 },
        orderQuantity: 370,
        extraPercent: 5,
      },
    ],
    fabrics: [
      {
        id: 'f1',
        kind: 'MAIN',
        name: 'Cotton 100%',
        consumptionPerPiece: 0.5,
        consumptionUnit: 'kg',
        combed: true,
      },
    ],
    accessories: [],
    accessoryPlacements: [],
    measurements: [],
    packing: {
      singleColorPerCarton: false,
      singleSizePerCarton: false,
    },
    mainLabelName: 'Zara',
    processes: [],
    notes: '',
    pos: [
      {
        id: 'po1',
        poNumber: 'PO-2024-001',
        quantity: 820,
        deliveryDate: '2024-12-31',
      },
    ],
    startDate: '2024-11-01',
    imageUrl: undefined,
    signOff: {
      preparedBy: 'PO Manager',
      reviewedBy: 'Quality Manager',
      approvedBy: 'Production Manager',
    },
    tracking: {
      status: 'CUTTING',
      progress: 35,
      assignedLine: 1,
      history: [
        {
          id: 'h1',
          orderId: 'wo-2024-001',
          timestamp: '2024-11-01T10:00:00.000Z',
          action: 'Order Created',
          user: 'PO Manager',
          note: 'Work order WO-2024-001 entered.',
        },
        {
          id: 'h2',
          orderId: 'wo-2024-001',
          timestamp: '2024-11-05T14:30:00.000Z',
          action: 'Status changed to Marker',
          user: 'Planner',
          note: 'Marker completed',
        },
        {
          id: 'h3',
          orderId: 'wo-2024-001',
          timestamp: '2024-11-07T08:00:00.000Z',
          action: 'Status changed to Cutting',
          user: 'Cutting Supervisor',
          note: 'Started cutting',
        },
      ],
    },
    createdAt: '2024-11-01T10:00:00.000Z',
    createdBy: 'PO Manager',
    updatedAt: '2024-11-14T15:30:00.000Z',
    updatedBy: 'PO Manager',
  },
  {
    id: 'wo-2024-002',
    workOrderNumber: 'WO-2024-002',
    client: 'H&M',
    garmentType: 'Jeans',
    modelName: 'STYLE-B-200',
    clientStyle: 'STYLE-B-200',
    ourStyle: 'FAC-B-200',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      {
        id: 'c3',
        name: 'Dark Blue',
        ratio: { '28': 1, '30': 1, '32': 1, '34': 1, '36': 1 },
        orderQuantity: 400,
        extraPercent: 5,
      },
    ],
    fabrics: [
      {
        id: 'f2',
        kind: 'MAIN',
        name: 'Denim',
        consumptionPerPiece: 1.2,
        consumptionUnit: 'm',
        combed: false,
      },
    ],
    accessories: [],
    accessoryPlacements: [],
    measurements: [],
    packing: {
      singleColorPerCarton: false,
      singleSizePerCarton: false,
    },
    mainLabelName: 'H&M',
    processes: [],
    notes: '',
    pos: [
      {
        id: 'po2',
        poNumber: 'PO-2024-002',
        quantity: 400,
        deliveryDate: '2024-12-15',
      },
    ],
    startDate: '2024-10-20',
    imageUrl: undefined,
    signOff: {
      preparedBy: 'PO Manager',
      reviewedBy: 'Quality Manager',
      approvedBy: 'Production Manager',
    },
    tracking: {
      status: 'PENDING',
      progress: 0,
      history: [
        {
          id: 'h4',
          orderId: 'wo-2024-002',
          timestamp: '2024-10-20T09:00:00.000Z',
          action: 'Order Created',
          user: 'PO Manager',
          note: 'Work order WO-2024-002 entered.',
        },
      ],
    },
    createdAt: '2024-10-20T09:00:00.000Z',
    createdBy: 'PO Manager',
    updatedAt: '2024-10-20T09:00:00.000Z',
    updatedBy: 'PO Manager',
  },
];

/**
 * Initialize IndexedDB with sample data on first load
 */
export async function initializeIndexedDB(): Promise<void> {
  // Check if already initialized
  const initialized = localStorage.getItem(INIT_KEY);
  if (initialized === 'true') {
    console.log('✅ IndexedDB already initialized');
    return;
  }

  try {
    // Check if there are existing orders
    const existingOrders = await dbGetAll<WorkOrder>('workOrders');
    
    if (existingOrders.length > 0) {
      console.log(`✅ IndexedDB already has ${existingOrders.length} orders`);
      localStorage.setItem(INIT_KEY, 'true');
      return;
    }

    // Add sample orders
    console.log('🔧 Initializing IndexedDB with sample orders...');
    await dbWrite(
      SAMPLE_WORK_ORDERS.map((order) => ({
        store: 'workOrders' as const,
        put: order,
      }))
    );

    localStorage.setItem(INIT_KEY, 'true');
    console.log(`✅ IndexedDB initialized with ${SAMPLE_WORK_ORDERS.length} sample orders`);
  } catch (error) {
    console.error('❌ Error initializing IndexedDB:', error);
  }
}

/**
 * Reset IndexedDB (for testing)
 */
export function resetIndexedDB(): void {
  localStorage.removeItem(INIT_KEY);
  console.log('🔄 IndexedDB reset flag cleared. Refresh to reinitialize.');
}
