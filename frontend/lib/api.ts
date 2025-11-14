/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

export interface ScanResponse {
  message: string
  currentLevel: number
  flag: string
}

export interface TeamData {
  id: string
  name: string
  currentLevel: number
  cohort: {
    id: number
    name: string
  }
  capturedFlags?: Flag[]
}

export interface CohortTeamsData {
  cohort: {
    id: number
    name: string
  } | null
  teams: {
    id: string
    name: string
    currentLevel: number
  }[]
}

export interface Flag {
  level: number
  flag: string
  capturedAt: string
}

export interface ApiError {
  error: string
  details?: string
}

// =============================
// 🔥 NEW TOKEN-BASED QR SCAN
// =============================
export const scanQR = async (token: string, teamId: string): Promise<ScanResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan`, {
      token,
      teamId: teamId.trim(),
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}

// =============================
// Get Team Data
// =============================
export const getTeamData = async (teamId: string): Promise<TeamData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team/${teamId}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}

// =============================
// Get Cohort Teams
// =============================
export const getCohortTeams = async (cohortId: number): Promise<CohortTeamsData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cohort/${cohortId}/teams`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}

// =============================
// Get Cohort Leaderboard (OLD PRISMA LOGIC REMOVED)
// =============================
export const getCohortLeaderboard = async (cohortId: number): Promise<CohortTeamsData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cohort/${cohortId}/leaderboard`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}
