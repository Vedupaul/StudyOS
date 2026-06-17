import Image from 'next/image'

type AppLogoProps = {
    alt?: string
    className?: string
    size?: number
}

export function AppLogo({ alt = 'StudyOS logo', className = '', size = 64 }: AppLogoProps) {
    return <Image src="/studyos-logo.svg" alt={alt} width={size} height={size} className={className} priority />
}
