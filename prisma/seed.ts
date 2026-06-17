import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Seed achievements
    const achievements = [
        {
            name: 'First Session',
            description: 'Complete your first study session',
            icon: '🎯',
            category: 'milestones',
            requirementValue: 1,
        },
        {
            name: 'Early Bird',
            description: 'Study before 8 AM',
            icon: '🌅',
            category: 'habits',
            requirementValue: 1,
        },
        {
            name: 'Night Owl',
            description: 'Study after 10 PM',
            icon: '🦉',
            category: 'habits',
            requirementValue: 1,
        },
        {
            name: 'Consistency King',
            description: 'Study for 7 consecutive days',
            icon: '👑',
            category: 'streaks',
            requirementValue: 7,
        },
        {
            name: 'Marathon Master',
            description: 'Study for 4+ hours in a day',
            icon: '🏃',
            category: 'duration',
            requirementValue: 240,
        },
        {
            name: 'Focus Champion',
            description: 'Achieve 5★ focus score 10 times',
            icon: '⭐',
            category: 'quality',
            requirementValue: 10,
        },
        {
            name: 'Week Warrior',
            description: 'Complete 5 days of study in a week',
            icon: '💪',
            category: 'weekly',
            requirementValue: 5,
        },
        {
            name: 'Month Master',
            description: 'Study every day for a month',
            icon: '📅',
            category: 'monthly',
            requirementValue: 30,
        },
        {
            name: 'Pomodoro Pro',
            description: 'Complete 100 Pomodoro sessions',
            icon: '🍅',
            category: 'technique',
            requirementValue: 100,
        },
        {
            name: 'Subject Scholar',
            description: 'Study 5 different subjects',
            icon: '📚',
            category: 'variety',
            requirementValue: 5,
        },
        {
            name: 'Planner Perfectionist',
            description: 'Complete 10 daily plans 100%',
            icon: '✅',
            category: 'planning',
            requirementValue: 10,
        },
        {
            name: 'Dedicated Student',
            description: 'Accumulate 100 hours of study time',
            icon: '🎓',
            category: 'milestones',
            requirementValue: 6000,
        },
    ]

    for (const achievement of achievements) {
        await prisma.achievement.upsert({
            where: { name: achievement.name },
            update: {},
            create: achievement,
        })
    }

    // Seed specific user for Vedavrat Paul
    const email = 'vedavrat.paul@gmail.com'
    const passwordHash = '$2b$10$YourHashedPasswordHere' // Using a dummy bcrypt hash for 'password123'
    
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: '$2b$10$Kq2Y.jJvQpG/7Wv9M0qI.O7aO5Y9O5Y9O5Y9O5Y9O5Y9O5Y9O5Y9O', // hash for 'password123'
            name: 'Vedavrat Paul',
            isActive: true,
        }
    })

    const subject = await prisma.subject.upsert({
        where: { userId_name: { userId: user.id, name: 'Advanced AI' } },
        update: {},
        create: {
            userId: user.id,
            name: 'Advanced AI',
            color: '#8B5CF6',
        }
    })

    // Create 5 study sessions for today
    const now = new Date()
    for (let i = 0; i < 5; i++) {
        const startTime = new Date(now)
        startTime.setHours(now.getHours() - (i + 1))
        const endTime = new Date(startTime)
        endTime.setMinutes(startTime.getMinutes() + 45)

        await prisma.studySession.create({
            data: {
                userId: user.id,
                subjectId: subject.id,
                sessionType: 'focus',
                startTime,
                endTime,
                actualDuration: 45,
                focusScore: 5,
                isCompleted: true,
            }
        })
    }

    console.log('✅ Seeded achievements and user data')

    console.log('Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
