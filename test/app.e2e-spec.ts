import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types.js'
import { AppModule } from './../src/app.module.js'

describe('AppResolver (e2e)', () => {
    let app: INestApplication<App>

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    it('hello (query)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: '{ hello }' })
            .expect(200)
            .expect({ data: { hello: 'Hello World!' } })
    })

    it('serves Apollo Sandbox', () => {
        return request(app.getHttpServer())
            .get('/graphql')
            .set('Accept', 'text/html')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .expect(/embeddable-sandbox/)
    })

    afterEach(async () => {
        await app.close()
    })
})
