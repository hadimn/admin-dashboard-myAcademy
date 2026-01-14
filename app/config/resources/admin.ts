// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";

export interface Admins {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

export const adminsResource: ResourceConfig<Admins> = {
  name: "admins",
  singularName: "admin",
  endpoint: "admins",
  searchable: true,
  sortable: true,
  idField: "id",
  perPage: 5,
  fields: [
    {
      key: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
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
      required: true,
      showInTable: true,
      showInFormEdit: false,
      showInFormCreate: true,
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
      label: "Password",
      type: "password",
      required: true,
      showInTable: false,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: false,
    },
    {
      key: "password_confirmation",
      label: "Password Confirmation",
      type: "password",
      required: true,
      showInTable: false,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: false,
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
    {
      key: "last_used_at",
      label: "Status",
      type: "datetime",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
      render: (value) => {
        if (!value) {
          return `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-gray-400"></span>
          <span class="text-gray-400 italic">Never</span>
        </div>
      `;
        }

        const lastUsed = new Date(value).getTime();
        const now = new Date().getTime();
        const diffInMinutes = (now - lastUsed) / (1000 * 60);

        // If within 5 minutes, show Active with Green Dot
        if (diffInMinutes <= 5) {
          return `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-green-600 font-medium">Active</span>
        </div>
      `;
        }

        // Otherwise, show Last Seen with Red Dot and the Date
        return `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        <span class="text-gray-500 text-xs">
          Last seen: ${new Date(value).toLocaleString()}
        </span>
      </div>
    `;
      },
    },
  ],
};
