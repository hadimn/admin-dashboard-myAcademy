// app/types/crud.ts

export interface ResourceField {
  key: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox' | 'file' | 'password'
  required?: boolean
  options?: { label: string; value: any }[] // For select fields
  validation?: (value: any) => string | null
  showInTable?: boolean
  showInForm?: boolean
  showInDetail?: boolean
  render?: (value: any, item?: any) => string // Custom rendering for table/detail
}

export interface ResourceConfig<T = any> {
  name: string // e.g., 'users'
  singularName: string // e.g., 'user'
  endpoint: string // API endpoint
  fields: ResourceField[]
  idField?: string // Default: 'id'
  searchable?: boolean
  sortable?: boolean
  perPage?: number
}

export interface PaginatedResponse<T> {
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