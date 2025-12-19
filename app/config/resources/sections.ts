// app/config/resources/sections.ts
import type { ResourceConfig } from "~/types/crud";

export interface Section {
  section_id: number;
  course_id: number;
  title: string;
  description: string;
  image_url?: string;
  order: number;
  is_last?: boolean;
  created_at: string;
}

export const sectionsResource: ResourceConfig<Section> = {
  name: "sections",
  singularName: "section",
  endpoint: "sections",
  searchable: true,
  sortable: true,
  idField: "section_id",
  perPage: 15,
  fields: [
    {
      key: "section_id",
      label: "Section ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "course_id",
      label: "Course ID",
      type: "select",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      resource: "courses",
      optionLabel: "title",
      optionValue: "course_id",
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
      label: "Is Last Section?",
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
