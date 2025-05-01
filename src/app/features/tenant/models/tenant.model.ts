export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
  PreferNotToSay = 4
}

export enum TenantType {
  Student = 1,
  WorkingProfessional = 2,
  Bachelor = 3,
  Family = 4,
  Couple = 5,
  PropertyStaff = 6,
  RelativesAndFriends = 7,
  Others = 8
}

export enum PaymentMethod {
  None = 0,
  Cash = 1,
  BankTransfer = 2,
  CreditCard = 3,
  DebitCard = 4,
  UPI = 5,
  Other = 6
}

export enum ChargeType {
  Rent = 1,
  SecurityDeposit = 2,
  Maintenance = 3,
  Electricity = 4,
  Water = 5,
  Internet = 6,
  Other = 7
}

export interface CreateTenantPaymentRecordDto {
  tenantId: string;
  amount: number;
  dueDate: Date;
  paymentMethod: PaymentMethod;
  chargeType: ChargeType;
  fromDate: Date;
  toDate: Date;
  remarks?: string;
  paidDate?: Date;
}

export interface CreateTenantDto {
  name: string;
  emailId: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  tenantType: TenantType;
  roomId: string;
  dateOfJoining: Date;
  checkOutDate?: Date;
  rentAmount: number;
  securityDeposit: number;
  rentReceiptDay: number;
  paymentRecords: CreateTenantPaymentRecordDto[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  roomNumber: string;
  rentAmount: number;
  moveInDate: string;
} 