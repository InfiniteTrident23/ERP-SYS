"use client"
import { SidebarProvider } from '@workspace/ui/components/sidebar'
import { MainAppSidebar } from './sidebar'
import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({children}: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <SidebarProvider>
    <div className="flex h-screen w-full overflow-hidden bg-background">
       <MainAppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
  )
}

export default SidebarLayout