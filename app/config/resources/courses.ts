// app/config/resources/users.ts
import type { ResourceConfig } from "~/types/crud";
import { CourseLanguages } from "~~/constants/CourseLanguages";

export interface Courses {
  course_id: number;
  title: string;
  description: string;
  video_url?: string;
  image_url?: string;
  language: string;
  order: number;
  created_at: string;
  //   status: 'active' | 'inactive'
}

export const coursesResource: ResourceConfig<Courses> = {
  name: "courses",
  singularName: "course",
  endpoint: "courses",
  searchable: true,
  sortable: true,
  idField: "course_id",
  perPage: 15,
  aiGenerate: {
    enabled: true,
    fields: ["title", "description", "language"],
    prompt: `Generate a professional online course. Return concise, high-quality educational content.`,
  },
  fields: [
    {
      key: "course_id",
      label: "Course ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
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
      key: "language",
      label: "Language",
      type: "select",
      options: CourseLanguages,
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value.length < 2) {
          return "Language must be at least 2 characters";
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
