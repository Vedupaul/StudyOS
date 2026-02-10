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

    console.log('✅ Seeded achievements')

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
