// app/config/resources/questions.ts
import type { ResourceConfig } from "~/types/crud";

export interface UserBadges {
  user_badge_id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
}

export const userBadgesResource: ResourceConfig<UserBadges> = {
  name: "user_badges",
  singularName: "user badges",
  endpoint: "userbadge",
  searchable: true,
  sortable: true,
  idField: "user_badge_id",
  perPage: 15,
  fields: [
    {
      key: "user_badge_id",
      label: "User Badge ID",
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
      key: "badge_id",
      label: "Badge",
      type: "select",
      resource: "badges",
      optionLabel: "name",
      optionValue: "badge_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "earned_at",
      label: "Earned At",
      type: "datetime",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (!value) {
          return "Earned at date is required.";
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return "Invalid date format.";
        }
        // Optional: Ensure the date is not in the future
        if (date.getTime() > Date.now()) {
          return "Earned at date cannot be in the future.";
        }
        return null;
      },
    },
    
  ],
};
