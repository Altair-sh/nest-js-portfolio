import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { CompactLogger } from './logger/compact-logger.service.js'

async function bootstrap() {
    // hold startup logs until CompactLogger is attached
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    // resolve() instead of get(), because CompactLogger is transient-scoped
    app.useLogger(await app.resolve(CompactLogger))
    // handle SIGTERM, because node doesn't do it by default
    // and docker container waits 10 seconds until forced shutdown
    app.enableShutdownHooks()
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
await bootstrap()
