// app/types/crud.ts

export interface ResourceField {
  key: string
  label: string
  type: 'color' | 'file' | 'json' | 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox' | 'password' | 'datetime'
  required?: boolean
  options?: { label: string; value: any }[] // For select fields
  validation?: (value: any) => string | null
  showInTable?: boolean
  showInFormEdit?: boolean
  showInFormCreate?: boolean
  showInDetail?: boolean
  render?: (value: any, item?: any) => string // Custom rendering for table/detail
  resource?: string
  optionLabel?: string
  optionValue?: string
  fileType?: "image" | "video"
  // JSON field specific - for custom rendering in forms
  jsonType?: 'options' | 'correct_answer' | 'criteria' | 'custom',
}

export interface AIGenerateConfig {
  enabled: boolean
  prompt?: string
  fields?: string[] // which fields AI is allowed to fill
}

export interface ResourceConfig<T = any> {
  name: string // e.g., 'users'
  singularName: string // e.g., 'user'
  endpoint: string // API endpoint
  idField?: string // Default: 'id'
  searchable?: boolean
  sortable?: boolean
  perPage?: number
  fields: ResourceField[] // input fields 

  aiGenerate?: AIGenerateConfig
}

export interface PaginatedResponse<T> {
  status: string | number | boolean
  message: string
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiError {
  message: string
  errors?: Record<string, readonly string[]>
}