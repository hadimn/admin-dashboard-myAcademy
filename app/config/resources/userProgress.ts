// app/config/resources/questions.ts
import type { ResourceConfig } from "~/types/crud";

export interface UserProgress {
  progress_id: number;
  user_id: number;
  course_id: number;
  section_id: number;
  unit_id: number;
  lesson_id: number;
  is_completed: boolean;
  time_spent?: number;
  points?: number;
  started_at: string;
  completed_at?: string;
}

export const userProgressResource: ResourceConfig<UserProgress> = {
  name: "user_progress",
  singularName: "user progress",
  endpoint: "userprogress",
  searchable: true,
  sortable: true,
  idField: "progress_id",
  perPage: 15,
  fields: [
    {
      key: "progress_id",
      label: "Progress ID",
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
      key: "section_id",
      label: "Section",
      type: "select",
      resource: "sections",
      optionLabel: "title",
      optionValue: "section_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "unit_id",
      label: "Unit",
      type: "select",
      resource: "units",
      optionLabel: "title",
      optionValue: "unit_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "lesson_id",
      label: "Lesson",
      type: "select",
      resource: "lessons",
      optionLabel: "title",
      optionValue: "lesson_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "is_completed",
      label: "Is Completed?",
      type: "checkbox",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "time_spent",
      label: "Time Spent (minutes)",
      type: "number",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined && value < 0) {
          return "Time spent must be a non-negative number.";
        }
        return null;
      },
      render: (value) => {
        return value ?? "N/A";
      },
    },
    {
      key: "points",
      label: "Points Earned",
      type: "number",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined && value < 0) {
          return "Points must be a non-negative number.";
        }
        return null;
      },
      render: (value) => {
        return value ?? "N/A";
      },
    },
    {
      key: "started_at",
      label: "Started At",
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
  ],
};
