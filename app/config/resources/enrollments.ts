// app/config/resources/questions.ts
import type { ResourceConfig } from "~/types/crud";
import { PaymentMethod } from "~~/constants/PaymentMethods";
import { PaymentStatus } from "~~/constants/PaymentStatus";


export interface Enrollments {   
  enrollment_id: number;
  user_id: number;
  course_id: number;
  amount_paid?: number;
  payment_status: "pending" | "paid" | "failed" | "refunded" | "canceled";
  payment_method: string;
  transaction_id?: string;
  enrolled_at: string;
  completed_at?: string;
  created_at: string;
}

export const enrollmentsResource: ResourceConfig<Enrollments> = {
  name: "enrollments",
  singularName: "Enrollment",
  endpoint: "enrollments",
  searchable: true,
  sortable: true,
  idField: "enrollment_id",
  perPage: 15,
  fields: [
    {
      key: "enrollment_id",
      label: "Enrollment ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "user_id",
      label: "User",
      type: "select",
      resource: "users",
      optionLabel: "name",
      optionValue: "id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "course_id",
      label: "Course",
      type: "select",
      resource: "courses",
      optionLabel: "title",
      optionValue: "course_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "amount_paid",
      label: "Amount Paid",
      type: "number",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined && value < 0) {
          return "Amount paid must be a non-negative number.";
        }
        return null;
      },
      render: (value) => {
        return value ? `$${value.toFixed(2)}` : "N/A";
      },
    },
    {
      key: "payment_status",
      label: "Payment Status",
      type: "select",
      options: PaymentStatus,
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "payment_method",
      label: "Payment Method",
      type: "select",
      options: PaymentMethod,
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "transaction_id",
      label: "Transaction ID",
      type: "text",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "enrolled_at",
      label: "Enrolled At",
      type: "datetime",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "completed_at",
      label: "Completed At",
      type: "datetime",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "created_at",
      label: "Created At",
      type: "datetime",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
  ],
};
