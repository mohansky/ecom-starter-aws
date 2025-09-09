'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DashboardLink = () => {
  return (
    <Link href="/dashboard" className="mb-5" target="_blank" rel="noopener noreferrer">
      <Button variant="outline">Dashboard</Button>
    </Link>
    // <a
    //   href="/dashboard"
    //   target="_blank"
    //   rel="noopener noreferrer"
    //   style={{
    //     display: 'block',
    //     padding: '8px 16px',
    //     color: '#ffffff',
    //     textDecoration: 'none',
    //     borderRadius: '4px',
    //     margin: '4px 0',
    //     backgroundColor: '#007ACC',
    //     fontSize: '14px',
    //     fontWeight: '500',
    //   }}
    // >
    //   📊 Dashboard
    // </a>
  )
}

export default DashboardLink
