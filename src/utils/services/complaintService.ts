import { AxiosError } from 'axios'
import api from './api'
import type {
  ComplaintFilterParams,
  IComplaint,
  IComplaintStats,
  ICreateComplaint,
  IUpdateComplaint,
} from '@/models/complaint'
import { IApiError } from '@/models/api'

export class ComplaintService {
  async fetchComplaints(page: number, pageSize: number, filters?: ComplaintFilterParams) {
    try {
      const response = await api.get('/complaints', {
        params: {
          page,
          limit: pageSize,
          ...filters,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching complaints:', error)
      throw error
    }
  }

  async createComplaint(complaintData: ICreateComplaint) {
    try {
      const formData = new FormData()
      formData.append('title', complaintData.title)
      formData.append('description', complaintData.description)
      formData.append('category', complaintData.category)
      formData.append('priority', complaintData.priority)
      if (complaintData.relatedWorkerId) {
        formData.append('relatedWorkerId', complaintData.relatedWorkerId)
      }

      // if (complaintData.attachments) {
      //   for (let i = 0; i < complaintData.attachments.length; i++) {
      //     formData.append('attachments', complaintData.attachments[i])
      //   }
      // }

      const response = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating complaint:', error)
      throw error
    }
  }

  async updateComplaint(id: string, complaintData: IUpdateComplaint) {
    try {
      const formData = new FormData()
      if (complaintData.title) formData.append('title', complaintData.title)
      if (complaintData.description) formData.append('description', complaintData.description)
      if (complaintData.category) formData.append('category', complaintData.category)
      if (complaintData.priority) formData.append('priority', complaintData.priority)
      if (complaintData.status) formData.append('status', complaintData.status)
      if (complaintData.assignedToId) formData.append('assignedToId', complaintData.assignedToId)
      if (complaintData.resolution) formData.append('resolution', complaintData.resolution)

      // if (complaintData.attachments) {
      //   for (let i = 0; i < complaintData.attachments.length; i++) {
      //     formData.append('attachments', complaintData.attachments[i])
      //   }
      // }

      const response = await api.put(`/complaints/${id}`,formData)
      return response.data
    } catch (error) {
      console.error('Error updating complaint:', error)
      throw error
    }
  }

  async deleteComplaint(id: string) {
    try {
      const response = await api.delete(`/complaints/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting complaint:', error)
      throw error
    }
  }

  async getComplaintsStats(): Promise<IComplaintStats> {
    try {
      const response = await api.get('/complaints/stats')
      return response.data as IComplaintStats
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>)
    }
  }

  async updateComplaintStatus(id: string, status: string) {
    try {
      const response = await api.patch(`/complaints/${id}/status`, { status })
      return response.data.data
    } catch (error) {
      console.error('Error updating complaint status:', error)
      throw error
    }
  }

  async getComplaintById(id: string): Promise<IComplaint> {
    try {
      const response = await api.get(`/complaints/${id}`)
      return response.data.data as IComplaint
    } catch (error) {
      console.error('Error fetching complaint by ID:', error)
      throw error
    }
  }

  async sendResponseToComplaint(id: string, message: string) {
    try {
      const response = await api.post(`/complaints/${id}/responses`, {message: message} )
      return response.data
    } catch (error) {
      console.error('Error sending response to complaint:', error)
      throw error
    }
  }

  private handleError(error: AxiosError<IApiError>): Error {
    const message = error.response?.data?.message ?? error.message ?? 'An error occurred'
    return new Error(message)
  }
}
