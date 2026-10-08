import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMemberStore } from '@store/memberStore'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
import { GateLayout } from './GateLayout'

export function CallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const handleCallback = useMemberStore((s) => s.handleCallback)
  const error = useMemberStore((s) => s.error)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // codes are single use; StrictMode runs effects twice
    ran.current = true
    const whopError = params.get('error')
    if (whopError) {
      const why = params.get('error_description')
      useMemberStore.setState({ error: why ? `Whop said: ${why}.` : 'Sign-in was cancelled.' })
      return
    }
    handleCallback(params.get('code'), params.get('state')).then((ok) => {
      if (ok) navigate('/', { replace: true })
    })
  }, [params, handleCallback, navigate])

  return (
    <GateLayout>
      {error ? (
        <>
          <p role="alert" className="text-text-muted text-sm">{error}</p>
          <Button variant="gold" size="lg" fullWidth onClick={() => navigate('/', { replace: true })}>Back</Button>
        </>
      ) : (
        <>
          <Spinner size="lg" />
          <p className="text-text-muted text-sm">Checking your membership</p>
        </>
      )}
    </GateLayout>
  )
}
