// app/config/resources/questions.ts
import type { ResourceConfig } from "~/types/crud";

export interface AnsweredQuestions {
  answered_id: number;
  user_id: number;
  questions_id: number;
  earned_points?: number;
  is_passed?: boolean;
  created_at: string;
}

export const answeredQuestionsResource: ResourceConfig<AnsweredQuestions> = {
  name: "answered_questions",
  singularName: "answered question",
  endpoint: "answeredquestions",
  searchable: true,
  sortable: true,
  idField: "answered_id",
  perPage: 15,
  fields: [
    {
      key: "answered_id",
      label: "Answer ID",
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
      key: "questions_id",
      label: "Question",
      type: "select",
      resource: "questions",
      optionLabel: "title",
      optionValue: "questions_id",
      required: true,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "earned_points",
      label: "Earned Points",
      type: "number",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined && value < 0) {
          return "Earned points must be a non-negative number.";
        }
        return null;
      },
      render: (value) => {
        return value ?? "N/A";
      },
    },
    {
      key: "is_passed",
      label: "Passed?",
      type: "checkbox",
      required: false,
      showInTable: true,
      showInFormCreate: true,
      showInFormEdit: true,
      showInDetail: true,
    },
    {
      key: "created_at",
      label: "Answered At",
      type: "datetime",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
      showInDetail: true,
    },
  ],
};
