import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const pressStart2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-press-start-2p',
})

export const metadata: Metadata = {
    title: 'StudyOS - Study & Focus Management',
    description: 'Boost your productivity with Pomodoro timers, study planners, and detailed analytics',
    icons: {
        icon: '/studyos-logo.svg',
        shortcut: '/studyos-logo.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={pressStart2P.variable}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
