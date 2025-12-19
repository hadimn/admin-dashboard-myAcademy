// app/config/resources/questions.ts
import type { ResourceConfig } from "~/types/crud";

export interface Questions {
  questions_id: number;
  lesson_id: number;
  title: string;
  description: string;
  question_type: "mcq" | "fill" | "torf" | "checkbox" | "matching";
  video_url?: string;
  image_url?: string;
  points: number;
  is_last?: boolean;
  options?: Record<string, any>; // JSON type
  correct_answer: Record<string, any>; // JSON type
  explanation?: string;
  order: number;
  created_at: string;
}

export const questionsResource: ResourceConfig<Questions> = {
  name: "questions",
  singularName: "question",
  endpoint: "questions",
  searchable: true,
  sortable: true,
  idField: "questions_id",
  perPage: 15,
  fields: [
    {
      key: "question_id",
      label: "Question ID",
      type: "number",
      showInTable: true,
      showInFormCreate: false,
      showInFormEdit: false,
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
      key: "title",
      label: "Question Title",
      type: "text",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value && value.length < 5) {
          return "Question title must be at least 5 characters";
        }
        return null;
      },
    },
    {
      key: "description",
      label: "Question Description",
      type: "textarea",
      required: false,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "question_type",
      label: "Question Type",
      type: "select",
      options: [
        { label: "Multiple Choice (MCQ)", value: "mcq" },
        { label: "Fill in the Blanks", value: "fill" },
        { label: "True or False", value: "torf" },
        { label: "Multiple Answers (Checkbox)", value: "checkbox" },
        { label: "Matching", value: "matching" },
      ],
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "image_url",
      label: "Question Image",
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
      label: "Question Video",
      type: "file",
      required: false,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      fileType: "video",
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
      validation: (value) => {
        if (value === null || value === undefined) {
          return "Points are required.";
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
          return "Points must be a non-negative number.";
        }
        return null;
      },
    },
    {
      key: "options",
      label: "Answer Options",
      type: "json",
      required: false, // Will be validated dynamically based on question_type
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      jsonType: 'options', // This tells the form to use the special options UI
      render: (value) => {
        if (!value || !Array.isArray(value)) return '-';
        return value.map((opt: any, i: number) => 
          `${String.fromCharCode(65 + i)}. ${opt.text}${opt.is_correct ? ' ✓' : ''}`
        ).join(', ');
      }
    },
    {
      key: "correct_answer",
      label: "Correct Answer",
      type: "json",
      required: true,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      jsonType: 'correct_answer', // This tells the form to use the special correct answer UI
      render: (value) => {
        if (!value || !Array.isArray(value)) return '-';
        return value.join(', ');
      }
    },
    {
      key: "explanation",
      label: "Answer Explanation",
      type: "textarea",
      required: false,
      showInTable: false,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
    },
    {
      key: "order",
      label: "Display Order",
      type: "number",
      required: false,
      showInTable: true,
      showInFormEdit: true,
      showInFormCreate: true,
      showInDetail: true,
      validation: (value) => {
        if (value !== null && value !== undefined && value < 0) {
          return "Order must be 0 or greater";
        }
        return null;
      },
    },
    {
      key: "is_last",
      label: "Is Last Question in Lesson?",
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