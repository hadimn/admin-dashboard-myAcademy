// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";

export interface Badges {
  badge_id: number;
  name: string;
  description: string;
  icon?: string;
  type: string;
  criteria: Record<string, any>;
  points: number;
  //   status: 'active' | 'inactive'
}

export const badgesResource: ResourceConfig<Badges> = {
  name: "badges",
  singularName: "badge",
  endpoint: "badges",
  searchable: true,
  sortable: true,
  idField: "badge_id",
  perPage: 15,
  fields: [
    {
      key: "badge_id",
      label: "Badge ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "icon",
      label: "Icon URL",
      type: "file",
      render: (value) => value ? `<img src="${value}" class="w-10 h-10 rounded-full object-cover" />` : '-',
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
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
      key: "description",
      label: "Description",
      type: "textarea",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "points",
      label: "Points",
      type: "number",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Streak", value: "streak" },
        { label: "Course Completion", value: "course_completion" },
        { label: "Points", value: "points" },
        { label: "Lesson Completion", value: "lesson_completion" },
        { label: "Time Spent", value: "time_spent" },
      ],
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "criteria",
      label: "Criteria",
      type: "json", // custom type
      required: true,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
  ],
};
