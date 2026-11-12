/**
 * Production orders service (the production dashboard and order details).
 *
 * There is no separate data: every production order is a work order saved from the form
 * (IndexedDB on this device). This file only reads those work orders in the shape the dashboard
 * needs, and stores the production status / history on the same record.
 * To connect a backend later, replace the reads and writes below; the screens stay the same.
 */
import { currentUser } from '../config/brand';
import { statusConfig } from '../config/statusConfig';
import type {
  FabricUnit,
  ProductionHistoryEvent,
  ProductionOrder,
  ProductionStatus,
} from '../types/production';
import type { WorkOrder } from '../types/workOrder';
import { calculateWorkOrderTotals, planColor } from '../utils/workOrderCalc';
import { getLineForStatus, isTransitionAllowed } from '../utils/workflow';
import { InvalidTransitionError, OrderNotFoundError } from './errors';
import { dbGet, dbGetAll } from './localDb';
import { historyEvent, updateWorkOrderTracking } from './workOrdersService';

/** The work order as a dashboard row. */
export function toProductionOrder(order: WorkOrder): ProductionOrder {
  const totals = calculateWorkOrderTotals(order);
  const fabric = order.fabrics.find((item) => item.kind === 'MAIN' && (item.consumptionPerPiece ?? 0) > 0)
    ?? order.fabrics.find((item) => (item.consumptionPerPiece ?? 0) > 0);
  const fabricByColor: Record<string, number> = {};
  for (const color of order.colors) {
    const pieces = planColor(color, order.sizes).cutPieces;
    fabricByColor[color.name] = Math.round(pieces * (fabric?.consumptionPerPiece ?? 0) * 100) / 100;
  }
  const deliveries = order.pos.map((po) => po.deliveryDate).filter(Boolean).sort();
  const tracking = order.tracking;
  const unit: FabricUnit = fabric?.consumptionUnit ?? 'kg';

  return {
    id: order.id,
    poNumber: order.pos.map((po) => po.poNumber).join(', ') || order.workOrderNumber,
    client: order.client,
    product: order.modelName || order.garmentType,
    colors: order.colors.map((color) => color.name),
    fabricByColor,
    fabricQuantity: Math.round(Object.values(fabricByColor).reduce((sum, value) => sum + value, 0) * 100) / 100,
    fabricUnit: unit,
    totalPieces: totals.orderedPieces,
    // Only the sizes that are actually ordered.
    sizes: order.sizes.filter((size) => (totals.orderedPerSize[size] ?? 0) > 0),
    sizeBreakdown: Object.fromEntries(order.sizes.map((size) => [size, totals.orderedPerSize[size] ?? 0])),
    status: tracking?.status ?? 'PENDING',
    progress: tracking?.progress ?? statusConfig.PENDING.progress,
    orderDate: order.startDate,
    expectedDeliveryDate: deliveries[0] ?? order.startDate,
    assignedLine: tracking?.assignedLine,
    imageUrl: order.imageUrl || undefined,
  };
}

export async function getProductionOrders(): Promise<ProductionOrder[]> {
  const orders = await dbGetAll<WorkOrder>('workOrders');
  return orders
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toProductionOrder);
}

async function loadWorkOrder(id: string): Promise<WorkOrder> {
  const order = await dbGet<WorkOrder>('workOrders', id);
  if (!order) throw new OrderNotFoundError(id);
  return order;
}

export async function getProductionOrderById(id: string): Promise<ProductionOrder> {
  return toProductionOrder(await loadWorkOrder(id));
}

export async function getOrderHistory(id: string): Promise<ProductionHistoryEvent[]> {
  const order = await loadWorkOrder(id);
  const created: ProductionHistoryEvent = {
    id: `${id}-created`,
    orderId: id,
    timestamp: order.createdAt,
    action: 'Order Created',
    user: order.createdBy || currentUser.name,
    note: `Work order ${order.workOrderNumber} entered.`,
  };
  return [created, ...(order.tracking?.history ?? [])].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export async function getClients(): Promise<string[]> {
  const orders = await dbGetAll<WorkOrder>('workOrders');
  return [...new Set(orders.map((order) => order.client))].sort((a, b) => a.localeCompare(b));
}

export async function changeOrderStatus(
  id: string,
  status: ProductionStatus,
  note?: string,
): Promise<ProductionOrder> {
  const existing = await loadWorkOrder(id);
  const current = existing.tracking?.status ?? 'PENDING';
  if (!isTransitionAllowed(current, status)) {
    throw new InvalidTransitionError(statusConfig[current].label, statusConfig[status].label);
  }
  const updated = await updateWorkOrderTracking(id, (tracking) => ({
    ...tracking,
    status,
    progress: statusConfig[status].progress,
    assignedLine: getLineForStatus(status) ?? tracking.assignedLine,
    history: [
      ...tracking.history,
      historyEvent(id, `Status changed to ${statusConfig[status].label}`, note?.trim() || `Moved from ${statusConfig[current].label}.`),
    ],
  }));
  return toProductionOrder(updated);
}
