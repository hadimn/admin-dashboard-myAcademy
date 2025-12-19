// app/config/resources/units.ts
import type { ResourceConfig } from "~/types/crud";

export interface Units {
  unit_id: number;
  section_id: number;
  title: string;
  color: string;
  order: number;
  is_last?: boolean;
  created_at: string;
  //   status: 'active' | 'inactive'
}

export const unitsResource: ResourceConfig<Units> = {
  name: "units",
  singularName: "unit",
  endpoint: "units",
  idField: "unit_id",
  searchable: true,
  sortable: true,
  perPage: 15,
  fields: [
    {
      key: "unit_id",
      label: "Unit ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
    {
      key: "section_id",
      label: "Section ID",
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
      key: "color",
      label: "Color",
      type: "color",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
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
      label: "Is Last Unit?",
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
