// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";

export interface CoursePricing {
  pricing_id: number;
  course_id: number;
  price: number;
  is_free: boolean;
  discount_price?: number;
  discount_expires_at?: string;
  created_at: string;
}

export const CoursePricingResource: ResourceConfig<CoursePricing> = {
  name: "coursepricing",
  singularName: "course pricing",
  endpoint: "coursepricing",
  searchable: true,
  sortable: true,
  idField: "pricing_id",
  perPage: 15,
  fields: [
    {
      key: "pricing_id",
      label: "Pricing ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
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
        
      key: "price",
      label: "Price ($)",
      type: "number",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value === null || value === undefined) {
          return "Price is required.";
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
          return "Price must be a non-negative number.";
        }
        return null;
      },
    },
    {
      key: "is_free",
      label: "Is Free?",
      type: "checkbox",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "discount_price",
      label: "Discount Price ($)",
      type: "number",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined) {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            return "Discount price must be a non-negative number.";
          }
        }
        return null;
      },
    },
    {
      key: "discount_expires_at",
      label: "Discount Expires At",
      type: "date",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "created_at",
      label: "Created At",
      type: "date",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
  ],
};
