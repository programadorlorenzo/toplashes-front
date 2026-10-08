export interface Branch {
  id: number;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  workDays: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  userId?: number;
  branchIds: number[];
  serviceIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  duration: number;
  prepTime: number;
  isActive: boolean;
  branchAssignments: { branchId: number; isActive: boolean }[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  notes?: string;
  noShowCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserBranch {
  id: number;
  branchId: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  employeeId?: number;
  branches: UserBranch[];
  createdAt: string;
}

export interface Permission {
  id: number;
  code: string;
  description: string;
  module: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: Permission[];
  createdAt: string;
}

export type ReservationStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'client_present'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ReservationChannel = 'whatsapp' | 'phone' | 'in_person' | 'other';

export interface ReservationServiceLine {
  id: number;
  serviceId: number;
  employeeId: number;
  agreedPrice: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface ReservationStatusHistoryEntry {
  id: number;
  fromStatus?: ReservationStatus | null;
  toStatus: ReservationStatus;
  changedById: number;
  changedAt: string;
  reason?: string;
}

export interface Reservation {
  id: number;
  customerId: number;
  branchId: number;
  date: string;
  status: ReservationStatus;
  channel: ReservationChannel;
  notes?: string;
  createdById: number;
  totalAmount: string;
  discount: string;
  services: ReservationServiceLine[];
  statusHistory?: ReservationStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  employeeId: number;
  employeeName: string;
}

export interface ScheduleEntry {
  id: number;
  employeeId: number;
  branchId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleExceptionType =
  | 'absence'
  | 'block'
  | 'break'
  | 'day_off';

export interface ScheduleException {
  id: number;
  employeeId: number;
  date: string;
  type: ScheduleExceptionType;
  startTime?: string;
  endTime?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod =
  | 'cash'
  | 'yape'
  | 'plin'
  | 'transfer'
  | 'card'
  | 'other';

export type PaymentType = 'advance' | 'partial' | 'full' | 'refund';

export interface Payment {
  id: number;
  reservationId: number;
  amount: string;
  method: PaymentMethod;
  type: PaymentType;
  reference?: string;
  notes?: string;
  registeredById: number;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationBalance {
  totalAmount: string;
  discount: string;
  totalPaid: string;
  balance: string;
}

export interface CreateReservationServicePayload {
  serviceId: number;
  employeeId: number;
  startTime: string;
  agreedPrice?: number;
}

export interface CreateReservationPayload {
  customerId: number;
  branchId: number;
  date: string;
  channel: ReservationChannel;
  notes?: string;
  discount?: number;
  services: CreateReservationServicePayload[];
}

export interface TopServiceStat {
  serviceId: number;
  serviceName: string;
  count: number;
}

export interface DashboardDailyStats {
  reservationsToday: number;
  confirmedReservations: number;
  inServiceCount: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
  employeesAvailable: number;
  employeesOccupied: number;
  totalPaymentsReceived: string;
  pendingBalance: string;
  topServices: TopServiceStat[];
  averageServiceTime: number | null;
  estimateVsActualDiff: number | null;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: number;
  reservationServiceId: number;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  estimatedEnd?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentConflictWarning {
  hasConflict: boolean;
  nextAppointmentId?: number;
  nextScheduledStart?: string;
  effectiveEnd?: string;
  message?: string;
}
