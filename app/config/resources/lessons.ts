// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";

export interface Lessons {
    lesson_id: number;
    unit_id: number;
    title: string;
    description: string;
    content: string;
    video_url?: string;
    image_url?: string;
    duration: number;
    lesson_type: string;
    is_last?: boolean;
    chest_after: number;
    order: number;
    created_at: string;
}

export const lessonsResource: ResourceConfig<Lessons> = {
  name: "lessons",
  singularName: "lesson",
  endpoint: "lessons",
  searchable: true,
  sortable: true,
  idField: "lesson_id",
  perPage: 15,
  fields: [
    {
      key: "lesson_id",
      label: "Lesson ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "unit_id",
      label: "Unit ID",
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
      key: "image_url",
      label: "Image URL",
      type: "file",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      fileType: "image",
    },
    {
      key: "video_url",
      label: "Video URL",
      type: "file",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      fileType: "video",
    },
    {
      key: "title",
      label: "Title",
      type: "text",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value.length < 3) {
          return "Title must be at least 3 characters";
        }
        return null;
      },
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value.length < 10) {
          return "Description must be at least 10 characters";
        }
        return null;
      },
    },
    {
      key: "content",
      label: "Content",
      type: "textarea",
      required: false,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "duration",
      label: "Duration (minutes)",
      type: "number",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value === null || value === undefined) {
          return "Duration is required.";
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
          return "Duration must be a non-negative number.";
        }
        return null;
      },
    },
    {
      key: "lesson_type",
      label: "Lesson Type",
      type: "select",
      options: [
        // normal,review,practice
        { label: "Normal", value: "normal" },
        { label: "Review", value: "review" },
        { label: "Practice", value: "practice" },
      ],
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "chest_after",
      label: "Chest After (order)",
      type: "checkbox",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value < 0) {
          return "Chest After must be a non-negative number.";
        }
        return null;
      },
    },
    {
      key: "order",
      label: "Order",
      type: "number",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value < 0) {
          return "Order must be at least 0";
        }
        return null;
      },
    },
    {
      key: "is_last",
      label: "Is Last Lesson?",
      type: "checkbox",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
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
