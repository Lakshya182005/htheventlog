/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { scanQR } from '@/lib/api'

export default function ScanPage() {
  const params = useSearchParams()

  // hold token AFTER hydration
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = params.get('token')
    if (t) setToken(t)
  }, [params])

  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null as any)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamId.trim()) {
      setError('Team UID is required')
      return
    }

    if (!token) {
      setError('Invalid QR link. Missing token.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await scanQR(token, teamId)
      setResult(response)
    } catch (err: any) {
      setError(err.error || 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">QR SCAN</h1>

      {!token && (
        <div className="cyber-card text-red-400">
          Waiting for QR token...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="cyber-input"
          placeholder="Enter Team UID"
        />

        <button className="cyber-button" disabled={loading}>
          {loading ? 'Scanning...' : 'SCAN'}
        </button>
      </form>

      {result && (
        <div className="cyber-card">
          <div>{result.message}</div>
          <div>Flag: {result.flag}</div>
          <div>Current Level: {result.currentLevel}</div>
        </div>
      )}

      {error && (
        <div className="cyber-card text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
