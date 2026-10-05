// Fills the database with resume data.
// Run again after editing: old data is deleted first.

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// links, skills, experience and projects are deleted together with the profile
await prisma.profile.deleteMany()

await prisma.profile.create({
    data: {
        name: 'Tsimafei Melnik',
        headline: 'Backend developer',
        description:
            "I'm a backend developer with 2 years of work experience. In June 2026 i graduated from International Information Technologies University (Amlaty, Kazakhstan) with Bachelor's degree in Computer Science. Education there was conducted in English, so i learned this language to C1 level.",
        links: {
            create: [
                { label: 'GitHub', url: 'https://github.com/Altair-sh' },
                {
                    label: 'LinkedIn',
                    url: 'https://www.linkedin.com/in/tsimafei-melnik-a4446a441',
                },
                {
                    label: 'My own git server',
                    url: 'https://timerix.ddns.net/git/Timerix',
                },
            ],
        },
        education: {
            create: [
                {
                    label: "Bachelor's degree (Computer Science)",
                    place: 'International Information Technologies University (Amlaty, Kazakhstan)',
                    year: 2026,
                },
                {
                    label: 'English language level: C1 (IELTS 7.5)',
                    place: 'IDP IELTS, Almaty',
                    year: 2026,
                },
                {
                    label: 'Claude 101',
                    place: 'https://anthropic.skilljar.com',
                    year: 2026,
                    certificateUrl:
                        'https://verify.skilljar.com/c/j6qmx28234cm',
                },
                {
                    label: 'Claude Code 101',
                    place: 'https://anthropic.skilljar.com',
                    year: 2026,
                    certificateUrl:
                        'https://verify.skilljar.com/c/45uvk85dj4eg',
                },
            ],
        },
        skills: {
            create: [
                { name: 'C', level: 'EXPERT' },
                { name: 'C#', level: 'EXPERT' },
                { name: 'TypeScript', level: 'ADVANCED' },
                { name: 'JavaScript', level: 'ADVANCED' },
                { name: 'NodeJS', level: 'ADVANCED' },
                { name: 'Claude Code', level: 'ADVANCED' },
                { name: 'React', level: 'ADVANCED' },
                { name: 'C++', level: 'ADVANCED' },
                { name: 'Python', level: 'ADVANCED' },
                { name: 'Bash', level: 'ADVANCED' },
                { name: 'NestJS', level: 'INTERMEDIATE' },
                { name: 'FastAPI', level: 'INTERMEDIATE' },
                { name: 'Prisma', level: 'INTERMEDIATE' },
                { name: 'PostgreSQL', level: 'INTERMEDIATE' },
                { name: 'GraphQL', level: 'INTERMEDIATE' },
                { name: 'Git', level: 'INTERMEDIATE' },
                { name: 'GitHub CI', level: 'INTERMEDIATE' },
                { name: 'Docker', level: 'INTERMEDIATE' },
                { name: 'Docker Compose', level: 'INTERMEDIATE' },
                { name: 'Linux', level: 'INTERMEDIATE' },
                { name: 'S3 storage', level: 'INTERMEDIATE' },
                { name: 'Qt', level: 'BEGINNER' },
                { name: 'Go', level: 'BEGINNER' },
                { name: 'Rust', level: 'BEGINNER' },
            ],
        },
        experience: {
            create: [
                {
                    company: 'Gamri & K',
                    position: 'Junior backend developer',
                    description: 'Here i developed API services using NestJS',
                    startDate: new Date('2025-10-13'),
                    endDate: null,
                },
                {
                    company: 'NEXT Entertainment Center',
                    position: 'Fullstack Developer',
                    description:
                        'There I supported and updated websites, created different tools for company needs (mostly for system administration)',
                    startDate: new Date('2024-11-05'),
                    endDate: new Date('2025-06-22'),
                },
            ],
        },
        projects: {
            create: [
                {
                    name: 'Resume API',
                    url: 'https://github.com/Altair-sh/nest-js-portfolio',
                    description: 'This GraphQL API',
                    technologies: [
                        'TypeScript',
                        'Node.js',
                        'NestJS',
                        'GraphQL',
                        'Apollo',
                        'Prisma',
                        'PostgreSQL',
                        'Docker',
                    ],
                },
                {
                    name: 'Samruk Kazyna ERP',
                    url: 'https://github.com/Altair-sh/samruk-erp',
                    description:
                        'A storage system for report files (excel, csv, etc.) with online viewing. It has AI assistant answering questions about the context obtained using vector search. It was created for the Samruk-Kazyna Foundation, which manages state-owned companies in Kazakhstan',
                    technologies: [
                        'FastAPI',
                        'NextJS',
                        'Redis',
                        'Celery',
                        'PostgreSQL',
                        'Vector Search',
                        'OpenAI API',
                        'Docker Compose',
                        'Prometheus',
                        'Grafana',
                    ],
                },
            ],
        },
    },
})

await prisma.$disconnect()
console.log('Seed finished')
