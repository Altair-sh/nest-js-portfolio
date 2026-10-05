import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types.js'
import { AppModule } from './../src/app.module.js'
import { PrismaService } from './../src/prisma/prisma.service.js'

// what Prisma returns from the database
const mockData = {
    id: 1,
    name: 'Aaa Bbb',
    headline: 'developer',
    description: 'me',
    links: [
        { id: 1, profileId: 1, label: 'github', url: 'https://github.com' },
    ],
    skills: [
        { id: 1, profileId: 1, name: 'TypeScript', level: 'INTERMEDIATE' },
    ],
    experience: [
        {
            id: 1,
            profileId: 1,
            company: 'company',
            position: 'developer',
            description: null,
            startDate: new Date('2023-05-30'),
            endDate: null,
        },
    ],
    projects: [
        {
            id: 1,
            profileId: 1,
            name: 'project',
            description: null,
            url: null,
            technologies: ['NestJS'],
        },
    ],
}

describe('ProfileResolver (e2e)', () => {
    let app: INestApplication<App>

    beforeEach(async () => {
        const fakePrisma = {
            profile: { findFirstOrThrow: vi.fn().mockResolvedValue(mockData) },
        }
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(fakePrisma)
            .compile()

        app = testingModule.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    it('serves Apollo Sandbox', () => {
        return request(app.getHttpServer())
            .get('/graphql')
            .set('Accept', 'text/html')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .expect(/embeddable-sandbox/)
    })

    it('query profile', () => {
        const query = `{
            profile {
                name
                description
                skills { name level }
                experience { 
                    company 
                    position 
                    startDate { year month day } 
                    endDate { year } }
                projects { name technologies }
            }
        }`
        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200)
            .expect({
                data: {
                    profile: {
                        name: 'Aaa Bbb',
                        description: 'me',
                        skills: [{ name: 'TypeScript', level: 'INTERMEDIATE' }],
                        experience: [
                            {
                                company: 'company',
                                position: 'developer',
                                startDate: { year: 2023, month: 5, day: 30 },
                                endDate: null,
                            },
                        ],
                        projects: [
                            { name: 'project', technologies: ['NestJS'] },
                        ],
                    },
                },
            })
    })
})
