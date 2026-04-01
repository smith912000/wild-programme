import React, { useState } from 'react'
import { User, Key, Bell, Trash2, Download, Shield, ExternalLink } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Input } from '@shared/ui/Input'
import { Badge } from '@shared/ui/Badge'
import { useAuthStore } from '@store/authStore'
import { useAccessStore } from '@store/accessStore'
import { TIER_LABELS } from '@config/tiers'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Section({ title, children }) {
  return (
    <div className='mb-6'>
      <p className='section-label mb-3'>{title}</p>
      <Card className='divide-y divide-border overflow-hidden'>{children}</Card>
    </div>
  )
}

function Row({ icon: Icon, label, value, action, danger }) {
  return (
    <div className={'flex items-center justify-between px-4 py-3 ' + (danger ? 'bg-red-500/5' : '')}>
      <div className='flex items-center gap-3'>
        {Icon && <Icon className={'w-4 h-4 ' + (danger ? 'text-accent-red' : 'text-text-muted')} />}
        <div>
          <p className={'text-sm font-medium ' + (danger ? 'text-accent-red' : 'text-text-primary')}>{label}</p>
          {value && <p className='text-xs text-text-muted mt-0.5'>{value}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function SettingsPage() {
  const { user, signOut } = useAuthStore()
  const { tier, clearTier } = useAccessStore()
  const navigate = useNavigate()
  const [showClear, setShowClear] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleExport = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('wos_')) data[k] = localStorage.getItem(k)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'wild-os-export.json'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported')
  }

  const handleClearData = () => {
    Object.keys(localStorage).filter(k => k.startsWith('wos_')).forEach(k => localStorage.removeItem(k))
    clearTier()
    setShowClear(false)
    toast.success('Local data cleared')
    navigate('/login')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <AppShell title='Settings'>
      <PageWrapper>

        <Section title='Account'>
          <Row icon={User} label='Email' value={user?.email || 'Demo mode'} />
          <Row icon={Key} label='Change password' action={<Button variant='ghost' size='sm' onClick={() => setShowPassword(true)}>Change</Button>} />
        </Section>

        <Section title='Subscription'>
          <Row
            icon={Shield}
            label='Current tier'
            value={tier ? TIER_LABELS[tier] + ' access active' : 'No access — enter a code'}
            action={<Badge tier={tier || 0}>{tier ? TIER_LABELS[tier] : 'None'}</Badge>}
          />
          <Row
            label='Enter new code'
            value='Upgrade or restore access'
            action={<Button variant='ghost' size='sm' onClick={() => navigate('/unlock')}>Enter code</Button>}
          />
          <Row
            label='Get a plan'
            value='Visit Whop to purchase access'
            action={<ExternalLink className='w-4 h-4 text-text-muted' />}
          />
        </Section>

        <Section title='Data'>
          <Row icon={Download} label='Export data' value='Download all journal and log data as JSON' action={<Button variant='ghost' size='sm' onClick={handleExport}>Export</Button>} />
          <Row icon={Trash2} label='Clear local data' value='Removes all data from this device' danger action={<Button variant='danger' size='sm' onClick={() => setShowClear(true)}>Clear</Button>} />
        </Section>

        <Section title='Session'>
          <Row label='Sign out' action={<Button variant='ghost' size='sm' onClick={handleSignOut}>Sign out</Button>} />
        </Section>

        <Section title='About'>
          <Row label='Version' value='WILD OS v1.0.0' />
          <Row label='Theme' value='Dark mode (more themes coming)' />
          <Row label='Support' value='support@lucidperformance.io' />
        </Section>

        <Modal open={showClear} onClose={() => setShowClear(false)} title='Clear local data'>
          <p className='text-text-muted text-sm mb-4'>This will remove all journal entries, logs, and settings stored on this device. This cannot be undone.</p>
          <div className='flex gap-3'>
            <Button variant='ghost' className='flex-1' onClick={() => setShowClear(false)}>Cancel</Button>
            <Button variant='danger' className='flex-1' onClick={handleClearData}>Clear everything</Button>
          </div>
        </Modal>

        <Modal open={showPassword} onClose={() => setShowPassword(false)} title='Change password'>
          <Input type='password' label='New password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <div className='flex gap-3 mt-4'>
            <Button variant='ghost' className='flex-1' onClick={() => setShowPassword(false)}>Cancel</Button>
            <Button variant='primary' className='flex-1' onClick={() => { setShowPassword(false); toast.success('Password updated') }}>Update</Button>
          </div>
        </Modal>

      </PageWrapper>
    </AppShell>
  )
}