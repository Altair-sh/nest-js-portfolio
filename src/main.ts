import { existsSync } from 'node:fs'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { CompactLogger } from './logger/compact-logger.service.js'

// variables that are already set are not overwritten
if (existsSync('.env')) process.loadEnvFile('.env')

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    app.useLogger(await app.resolve(CompactLogger))
    // handle SIGTERM, because node doesn't do it by default
    // and docker container waits 10 seconds until forced shutdown
    app.enableShutdownHooks()
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
await bootstrap()
