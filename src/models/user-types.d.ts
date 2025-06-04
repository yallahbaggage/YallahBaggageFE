export interface UserInterface {
  agentNumber?: string | null
  identityNumber?: string | null
  firstName: string | null
  middleName?: string | null
  lastName: string | null
  role?: string | null
  roleNumber?: number | null
  id: number | null
  guid: string | null
  isActive: boolean | null
  createDate: Date | null
  createUserId?: number | null
  updateDate?: Date | null
  updateUserId?: number | null
}
