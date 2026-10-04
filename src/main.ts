import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    // handle SIGTERM, because node doesn't do it by default
    // and docker container waits 10 seconds until forced shutdown
    app.enableShutdownHooks()
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
await bootstrap()
