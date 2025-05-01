import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Gender, TenantType, CreateTenantDto, PaymentMethod, ChargeType, CreateTenantPaymentRecordDto } from '../../models/tenant.model';
import { FormsModule } from '@angular/forms';

enum PaymentStatus {
  NotPaid = 'Not Paid',
  Paid = 'Paid'
}

interface PaymentRecord {
  dueType: string;
  dueFor: string;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidDate?: Date;
}

interface EditPaymentDialogData {
  dueType: string;
  dueFor: string;
  dueAmount: number;
  dueDate: Date;
  dueEndDate: Date;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidDate?: Date;
  description: string;
}

interface RentReceiptDayOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-add-tenant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    DialogModule
  ],
  template: `
    <div class="surface-0 p-4">
      <form [formGroup]="tenantForm" (ngSubmit)="onSubmit()">
        <!-- Due Details -->
        <div class="mb-4">
          <div class="flex align-items-center gap-2 mb-3">
            <i class="pi pi-file text-xl"></i>
            <h3 class="text-xl m-0">Due Details</h3>
          </div>

          <div class="grid">
            <div class="col-12 field">
              <label for="name" class="block text-900 font-medium mb-2">Name</label>
              <input id="name" type="text" pInputText class="w-full" formControlName="name">
            </div>

            <div class="col-12 md:col-6 field">
              <label for="email" class="block text-900 font-medium mb-2">Email</label>
              <input id="email" type="email" pInputText class="w-full" formControlName="emailId">
            </div>

            <div class="col-12 md:col-6 field">
              <label for="phone" class="block text-900 font-medium mb-2">Phone Number</label>
              <input id="phone" type="tel" pInputText class="w-full" formControlName="phoneNumber">
            </div>

            <div class="col-12 md:col-6 field">
              <label for="dob" class="block text-900 font-medium mb-2">Date of Birth</label>
              <p-calendar id="dob" formControlName="dateOfBirth" [showIcon]="true" class="w-full"></p-calendar>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="gender" class="block text-900 font-medium mb-2">Gender</label>
              <p-dropdown id="gender" [options]="genderOptions" formControlName="gender" 
                optionLabel="label" optionValue="value" class="w-full"></p-dropdown>
            </div>

            <div class="col-12 field">
              <label for="tenantType" class="block text-900 font-medium mb-2">Tenant Type</label>
              <p-dropdown id="tenantType" [options]="tenantTypeOptions" formControlName="tenantType"
                optionLabel="label" optionValue="value" class="w-full"></p-dropdown>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="roomNumber" class="block text-900 font-medium mb-2">Room Number</label>
              <input id="roomNumber" type="text" pInputText class="w-full" [value]="roomNumber" readonly>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="joinDate" class="block text-900 font-medium mb-2">Date of Joining</label>
              <p-calendar id="joinDate" formControlName="dateOfJoining" [showIcon]="true" class="w-full" 
                (onSelect)="updatePaymentRecords()"></p-calendar>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="checkoutDate" class="block text-900 font-medium mb-2">Check Out Date (Optional)</label>
              <p-calendar id="checkoutDate" formControlName="checkOutDate" [showIcon]="true" class="w-full"></p-calendar>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="rentAmount" class="block text-900 font-medium mb-2">Rent Amount</label>
              <p-inputNumber id="rentAmount" formControlName="rentAmount" mode="currency" currency="INR" 
                [minFractionDigits]="0" class="w-full" (onInput)="updatePaymentRecords()"></p-inputNumber>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="securityDeposit" class="block text-900 font-medium mb-2">Security Deposit</label>
              <p-inputNumber id="securityDeposit" formControlName="securityDeposit" mode="currency" currency="INR"
                [minFractionDigits]="0" class="w-full"></p-inputNumber>
            </div>

            <div class="col-12 md:col-6 field">
              <label for="rentReceiptDay" class="block text-900 font-medium mb-2">Rent Receipt Day</label>
              <p-dropdown id="rentReceiptDay" [options]="rentReceiptDayOptions" formControlName="rentReceiptDay"
                optionLabel="label" optionValue="value" class="w-full" (onChange)="updatePaymentRecords()"></p-dropdown>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mb-4">
          <div class="flex align-items-center justify-content-between mb-3">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-money-bill text-xl"></i>
              <h3 class="text-xl m-0">Payment Details</h3>
            </div>
          </div>

          <!-- Payment Records Table -->
          <p-table [value]="paymentRecords" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th>DUE TYPE</th>
                <th>DUE FOR</th>
                <th>DUE AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th>PAID DATE</th>
                <th>ACTIONS</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-record>
              <tr>
                <td>{{record.dueType}}</td>
                <td>{{record.dueFor}}</td>
                <td class="text-red-500">₹{{record.dueAmount}}</td>
                <td>{{PaymentMethod[record.paymentMethod]}}</td>
                <td [ngClass]="{
                  'text-red-500': record.paymentStatus === PaymentStatus.NotPaid,
                  'text-green-500': record.paymentStatus === PaymentStatus.Paid
                }">{{record.paymentStatus}}</td>
                <td>{{record.paidDate | date:'mediumDate'}}</td>
                <td>
                  <button pButton icon="pi pi-pencil" 
                    class="p-button-text p-button-rounded" 
                    (click)="editPayment(record)">
                  </button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="flex justify-content-end gap-2">
          <p-button label="Cancel" (onClick)="onCancel()" styleClass="p-button-text"></p-button>
          <p-button type="submit" label="Save" [loading]="isSubmitting"></p-button>
        </div>
      </form>
    </div>

    <!-- Edit Payment Dialog -->
    <p-dialog 
      [(visible)]="showEditDialog" 
      [header]="'Edit ' + selectedPayment?.dueType"
      [modal]="true"
      [style]="{width: '450px'}"
      [draggable]="false"
      [resizable]="false">
      <ng-template pTemplate="content">
        <form [formGroup]="editForm" class="flex flex-column gap-3 w-full" *ngIf="selectedPayment">
          <div class="field">
            <label for="dueAmount" class="block text-900 font-medium mb-2">Due Amount</label>
            <p-inputNumber id="dueAmount" 
              formControlName="dueAmount"
              mode="currency" 
              currency="INR"
              [minFractionDigits]="0"
              class="w-full">
            </p-inputNumber>
            <small class="p-error block" *ngIf="editForm.get('dueAmount')?.invalid && editForm.get('dueAmount')?.touched">
              Amount must be greater than or equal to 0
            </small>
          </div>

          <div class="field">
            <label for="paymentMethod" class="block text-900 font-medium mb-2">Payment Method</label>
            <p-dropdown id="paymentMethod"
              formControlName="paymentMethod"
              [options]="paymentMethodOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full">
            </p-dropdown>
            <small class="p-error block" *ngIf="editForm.get('paymentMethod')?.invalid && editForm.get('paymentMethod')?.touched">
              Please select a payment method
            </small>
          </div>

          <div class="field">
            <label for="paymentStatus" class="block text-900 font-medium mb-2">Payment Status</label>
            <p-dropdown id="paymentStatus"
              formControlName="paymentStatus"
              [options]="paymentStatusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full">
            </p-dropdown>
            <small class="p-error block" *ngIf="editForm.get('paymentStatus')?.invalid && editForm.get('paymentStatus')?.touched">
              Please select a payment status
            </small>
          </div>

          <div class="field">
            <label for="paidDate" class="block text-900 font-medium mb-2">Paid Date</label>
            <p-calendar id="paidDate"
              formControlName="paidDate"
              [showIcon]="true"
              class="w-full">
            </p-calendar>
            <small class="p-error block" *ngIf="editForm.get('paidDate')?.invalid && editForm.get('paidDate')?.touched">
              Please select a paid date
            </small>
          </div>
        </form>
      </ng-template>
      <ng-template pTemplate="footer">
        <p-button icon="pi pi-times" label="Cancel" (onClick)="closeEditDialog()" styleClass="p-button-text"></p-button>
        <p-button icon="pi pi-check" label="Save" (onClick)="savePaymentChanges()" [disabled]="!editForm.valid"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .field {
        margin-bottom: 1.5rem;
      }
      .p-inputnumber {
        width: 100%;
      }
      .p-calendar {
        width: 100%;
      }
      .p-dropdown {
        width: 100%;
      }
    }
  `]
})
export class AddTenantDialogComponent implements OnInit {
  tenantForm: FormGroup;
  editForm: FormGroup;
  isSubmitting = false;
  roomNumber: string = '';
  paymentRecords: PaymentRecord[] = [];
  showEditDialog = false;
  selectedPayment: PaymentRecord | null = null;
  PaymentMethod = PaymentMethod;
  PaymentStatus = PaymentStatus;

  genderOptions = Object.entries(Gender)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label, value]) => ({ label, value }));

  tenantTypeOptions = Object.entries(TenantType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label, value]) => ({ label, value }));

  paymentMethodOptions = Object.entries(PaymentMethod)
    .filter(([key]) => isNaN(Number(key)))
    .filter(([key]) => key !== 'None')
    .map(([label, value]) => ({ label, value }));

  paymentStatusOptions = Object.values(PaymentStatus).map(value => ({
    label: value,
    value: value
  }));

  rentReceiptDayOptions: RentReceiptDayOption[] = [
    ...Array.from({ length: 28 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1
    })),
    {
      label: 'End of month',
      value: -1
    }
  ];

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    const today = new Date();
    const onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      emailId: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      dateOfBirth: [null, Validators.required],
      gender: [null, Validators.required],
      tenantType: [null, Validators.required],
      dateOfJoining: [onlyDate, Validators.required],
      checkOutDate: [null],
      rentAmount: [null, [Validators.required, Validators.min(0)]],
      securityDeposit: [null, [Validators.required, Validators.min(0)]],
      rentReceiptDay: [1, Validators.required],
      rentPaymentMethod: [PaymentMethod.Cash, Validators.required],
      depositPaymentMethod: [PaymentMethod.Cash, Validators.required]
    });

    this.editForm = this.fb.group({
      dueAmount: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: [PaymentMethod.Cash, Validators.required],
      paymentStatus: [PaymentStatus.NotPaid, Validators.required],
      paidDate: [null]
    });

    // Add validator for paidDate when status is Paid
    this.editForm.get('paymentStatus')?.valueChanges.subscribe(status => {
      const paidDateControl = this.editForm.get('paidDate');
      if (status === PaymentStatus.Paid) {
        paidDateControl?.setValidators([Validators.required]);
      } else {
        paidDateControl?.clearValidators();
        paidDateControl?.setValue(null);
      }
      paidDateControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    const { roomId, roomName, rentAmount } = this.config.data;
    this.roomNumber = roomName;
    this.tenantForm.patchValue({
      rentAmount,
      securityDeposit: rentAmount * 2
    });
    this.updatePaymentRecords();
  }

  updatePaymentRecords() {
    const formValue = this.tenantForm.value;
    if (!formValue.dateOfJoining || !formValue.rentAmount) return;

    const rentAmount = formValue.rentAmount;
    const securityDeposit = rentAmount * 2;
    const joinDate = new Date(this.tenantForm.value.dateOfJoining);
    const currentYear = joinDate.getFullYear();
    const currentMonth = joinDate.getMonth();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentMonthRentReceiptDate = new Date(joinDate.getFullYear(), currentMonth, formValue.rentReceiptDay === -1 ? daysInCurrentMonth : formValue.rentReceiptDay);
    const nextMonth = currentMonth + 1;
    const receiptDay = formValue.rentReceiptDay;

    // Get days in current and next month
    const daysInNextMonth = new Date(currentYear, nextMonth + 1, 0).getDate();
    const nextMonthRentReceiptDate = new Date(joinDate.getFullYear(), nextMonth, formValue.rentReceiptDay === -1 ? daysInNextMonth : formValue.rentReceiptDay);
    
    // Calculate first month's rent period
    let firstMonthStartDate: Date;
    let firstMonthEndDate: Date;
    let firstMonthRent = formValue.rentAmount;
    firstMonthStartDate = joinDate;
    firstMonthEndDate = new Date(nextMonthRentReceiptDate); // clone the original
    firstMonthEndDate.setDate(firstMonthEndDate.getDate() - 1);
    const daysDiff = Math.abs((firstMonthStartDate.getTime() - firstMonthEndDate.getTime()) / (1000 * 3600 * 24)) + 1;

    const remainingDays = daysDiff;
    const totalDays = daysInCurrentMonth;
    firstMonthRent = Math.round((formValue.rentAmount * remainingDays) / totalDays);

    // Calculate next month's rent period
    const nextMonthStartDate = new Date(nextMonthRentReceiptDate);
    const nextMonthEndDate = new Date(nextMonthStartDate);
    nextMonthEndDate.setMonth(nextMonthEndDate.getMonth() + 1);
    nextMonthEndDate.setDate(nextMonthEndDate.getDate() - 1)

    // Update payment records
    this.paymentRecords = [
      {
        dueType: 'Security Deposit',
        dueFor: 'One Time',
        dueAmount: securityDeposit,
        paymentMethod: formValue.depositPaymentMethod,
        paymentStatus: PaymentStatus.NotPaid
      },
      {
        dueType: `${firstMonthStartDate.toLocaleString('default', { month: 'short' })} Rent`,
        dueFor: this.formatDateRange(firstMonthStartDate, firstMonthEndDate),
        dueAmount: firstMonthRent,
        paymentMethod: formValue.rentPaymentMethod,
        paymentStatus: PaymentStatus.NotPaid
      },
      {
        dueType: `${nextMonthStartDate.toLocaleString('default', { month: 'short' })} Rent`,
        dueFor: this.formatDateRange(nextMonthStartDate, nextMonthEndDate),
        dueAmount: rentAmount,
        paymentMethod: formValue.rentPaymentMethod,
        paymentStatus: PaymentStatus.NotPaid
      }
    ];

    // Update the form's security deposit
    this.tenantForm.patchValue({ securityDeposit }, { emitEvent: false });
  }

  formatDateRange = (start: Date, end: Date) => {
    return `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })}' ${start.getFullYear().toString().slice(-2)} - ${end.getDate()} ${end.toLocaleString('default', { month: 'short' })}' ${end.getFullYear().toString().slice(-2)}`;
  };

  generatePaymentRecords(formValue: any): CreateTenantPaymentRecordDto[] {
    const joinDate = new Date(formValue.dateOfJoining);
    const currentYear = joinDate.getFullYear();
    const currentMonth = joinDate.getMonth();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentMonthRentReceiptDate = new Date(joinDate.getFullYear(), currentMonth, formValue.rentReceiptDay === -1 ? daysInCurrentMonth : formValue.rentReceiptDay);
    const nextMonth = currentMonth + 1;
    const receiptDay = formValue.rentReceiptDay;

    // Get days in current and next month
    const daysInNextMonth = new Date(currentYear, nextMonth + 1, 0).getDate();
    const nextMonthRentReceiptDate = new Date(joinDate.getFullYear(), nextMonth, formValue.rentReceiptDay === -1 ? daysInNextMonth : formValue.rentReceiptDay);
    
    // Calculate first month's rent period
    let firstMonthStartDate: Date;
    let firstMonthEndDate: Date;
    let firstMonthRent = formValue.rentAmount;

    firstMonthStartDate = joinDate;
    firstMonthEndDate = new Date(nextMonthRentReceiptDate); // clone the original
    firstMonthEndDate.setDate(firstMonthEndDate.getDate() - 1);
    const daysDiff = Math.abs((firstMonthStartDate.getTime() - firstMonthEndDate.getTime()) / (1000 * 3600 * 24)) + 1;

    const remainingDays = daysDiff;
    const totalDays = daysInCurrentMonth;
    firstMonthRent = Math.round((formValue.rentAmount * remainingDays) / totalDays);

    // Calculate next month's rent period
    const nextMonthStartDate = new Date(nextMonthRentReceiptDate);
    const nextMonthEndDate = new Date(nextMonthStartDate);
    nextMonthEndDate.setMonth(nextMonthEndDate.getMonth() + 1);
    nextMonthEndDate.setDate(nextMonthEndDate.getDate() - 1);

    // Find corresponding payment records to get payment status and paid date
    const securityDepositRecord = this.paymentRecords.find(r => r.dueType === 'Security Deposit');
    const firstMonthRecord = this.paymentRecords.find(r => 
      r.dueType === `${firstMonthStartDate.toLocaleString('default', { month: 'short' })} Rent`
    );
    const nextMonthRecord = this.paymentRecords.find(r => 
      r.dueType === `${nextMonthStartDate.toLocaleString('default', { month: 'short' })} Rent`
    );

    return [
      {
        tenantId: '', // Will be set by backend
        amount: formValue.securityDeposit,
        dueDate: joinDate,
        paymentMethod: securityDepositRecord?.paymentMethod || formValue.depositPaymentMethod,
        chargeType: ChargeType.SecurityDeposit,
        fromDate: joinDate,
        toDate: joinDate,
        remarks: 'Security Deposit',
        paidDate: securityDepositRecord?.paymentStatus === PaymentStatus.Paid ? securityDepositRecord.paidDate : undefined
      },
      {
        tenantId: '', // Will be set by backend
        amount: firstMonthRent,
        dueDate: firstMonthEndDate,
        paymentMethod: firstMonthRecord?.paymentMethod || formValue.rentPaymentMethod,
        chargeType: ChargeType.Rent,
        fromDate: firstMonthStartDate,
        toDate: firstMonthEndDate,
        remarks: `Rent for ${firstMonthStartDate.toLocaleString('default', { month: 'long' })} ${currentYear}`,
        paidDate: firstMonthRecord?.paymentStatus === PaymentStatus.Paid ? firstMonthRecord.paidDate : undefined
      },
      {
        tenantId: '', // Will be set by backend
        amount: formValue.rentAmount,
        dueDate: nextMonthEndDate,
        paymentMethod: nextMonthRecord?.paymentMethod || formValue.rentPaymentMethod,
        chargeType: ChargeType.Rent,
        fromDate: nextMonthStartDate,
        toDate: nextMonthEndDate,
        remarks: `Rent for ${nextMonthStartDate.toLocaleString('default', { month: 'long' })} ${nextMonthStartDate.getFullYear()}`,
        paidDate: nextMonthRecord?.paymentStatus === PaymentStatus.Paid ? nextMonthRecord.paidDate : undefined
      }
    ];
  }

  onSubmit() {
    if (this.tenantForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.tenantForm.value;
    const paymentRecords = this.generatePaymentRecords(formValue);

    const tenantData: CreateTenantDto = {
      name: formValue.name,
      emailId: formValue.emailId,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      gender: formValue.gender,
      tenantType: formValue.tenantType,
      roomId: this.config.data.roomId,
      dateOfJoining: formValue.dateOfJoining,
      checkOutDate: formValue.checkOutDate,
      rentAmount: formValue.rentAmount,
      securityDeposit: formValue.securityDeposit,
      rentReceiptDay: formValue.rentReceiptDay,
      paymentRecords: paymentRecords
    };

    this.ref.close(tenantData);
  }

  onCancel() {
    this.ref.close();
  }

  editPayment(record: PaymentRecord) {
    this.selectedPayment = { ...record };
    this.editForm.patchValue({
      dueAmount: record.dueAmount,
      paymentMethod: record.paymentMethod,
      paymentStatus: record.paymentStatus,
      paidDate: record.paidDate
    });
    this.showEditDialog = true;
  }

  closeEditDialog() {
    this.selectedPayment = null;
    this.showEditDialog = false;
    this.editForm.reset({
      dueAmount: 0,
      paymentMethod: PaymentMethod.Cash,
      paymentStatus: PaymentStatus.NotPaid,
      paidDate: null
    });
  }

  savePaymentChanges() {
    if (this.selectedPayment && this.editForm.valid) {
      const formValue = this.editForm.value;
      
      // Find and update the payment record
      const index = this.paymentRecords.findIndex(r => 
        r.dueType === this.selectedPayment!.dueType && 
        r.dueFor === this.selectedPayment!.dueFor
      );
      
      if (index !== -1) {
        this.paymentRecords[index] = { 
          ...this.selectedPayment,
          dueAmount: formValue.dueAmount,
          paymentMethod: formValue.paymentMethod,
          paymentStatus: formValue.paymentStatus,
          paidDate: formValue.paymentStatus === PaymentStatus.Paid ? formValue.paidDate : undefined
        };
        
        // Update form payment methods if needed
        if (this.selectedPayment.dueType === 'Security Deposit') {
          this.tenantForm.patchValue({ 
            depositPaymentMethod: formValue.paymentMethod 
          });
        } else if (this.selectedPayment.dueType.includes('Rent')) {
          this.tenantForm.patchValue({ 
            rentPaymentMethod: formValue.paymentMethod 
          });
        }
      }
      
      this.closeEditDialog();
    }
  }
} 