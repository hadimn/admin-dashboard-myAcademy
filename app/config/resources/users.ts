// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  password: string;
  remember_token: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  device_token: string;
  created_at: string;
  updated_at: string;
  //   status: 'active' | 'inactive'
}

export const usersResource: ResourceConfig<User> = {
  name: "users",
  singularName: "user",
  endpoint: "users",
  idField: "id",
  searchable: true,
  sortable: true,
  perPage: 15,
  fields: [
    {
      key: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit:false,
      showInDetail: true,
    },
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      showInTable: true,
      showInFormEdit:true,
      showInFormCreate:true,
      showInDetail: true,
      validation: (value) => {
        if (value && value.length < 3) {
          return "Name must be at least 3 characters";
        }
        return null;
      },
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: false,
      showInTable: true,
      showInFormEdit:false,
      showInFormCreate:true,
      showInDetail: true,
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return "Invalid email format";
        }
        return null;
      },
    },
    {
      key: "password",
      label: "password",
      type: "password",
      required: false,
      showInTable: false,
      showInFormCreate: true,
      showInFormEdit: false,
      showInDetail: false,
    },
    {
      key: "password_confirmation",
      label: "Password Confirmation",
      type: "password",
      required: false,
      showInTable: false,
      showInFormCreate: true,
      showInFormEdit: false,
      showInDetail: false,
    },
    {
      key: "created_at",
      label: "Created At",
      type: "date",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
      render: (value) => {
        return value ? new Date(value).toLocaleString() : "-";
      },
    },
    {
      key: "remember_token",
      label: "Remember Token",
      type: "text", // Assuming this is a unique, system-generated identifier
      required: false, // Often optional/nullable in the database
      showInTable: false,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: false,
    },
    {
      key: "current_streak",
      label: "Current Streak",
      type: "number",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        // Check if a value is provided and is a valid number
        if (value === null || value === undefined) {
          return "Current streak is required.";
        }
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return "Current streak must be a number.";
        }
        if (!Number.isInteger(numValue) || numValue < 0) {
          return "Current streak must be a non-negative integer.";
        }
        return null;
      },
    },
    {
      key: "longest_streak",
      label: "Longest Streak",
      type: "number",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        // Check if a value is provided and is a valid number
        if (value === null || value === undefined) {
          return "Longest streak is required.";
        }
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return "Longest streak must be a number.";
        }
        if (!Number.isInteger(numValue) || numValue < 0) {
          return "Longest streak must be a non-negative integer.";
        }
        // Additional domain-specific validation: Current cannot exceed Longest
        // NOTE: This usually requires access to other fields, but we validate the field itself here.
        return null;
      },
    },
    {
      key: "last_activity_date",
      label: "Last Activity Date",
      type: "date", // Stored as a string, but represents a date
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (!value) {
          return "Last activity date is required.";
        }
        if (typeof value !== "string") {
          return "Last activity date must be a string.";
        }

        // Attempt to parse the date string
        const date = new Date(value);

        // Check if Date object is valid AND if the original value matches the format you expect
        // The second check prevents '123' from being considered a valid date in some browsers
        if (isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
          return "Invalid date format. Please use YYYY-MM-DD.";
        }

        // Optional: Check if the date is not in the future
        if (date.getTime() > Date.now()) {
          return "Last activity date cannot be in the future.";
        }

        return null;
      },
    },
    {
      key: "device_token",
      label: "Device Token",
      type: "text", // Used for push notifications (FCM/APNS)
      required: false, // Usually optional
      showInTable: false,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: false,
    },
  ],
};
