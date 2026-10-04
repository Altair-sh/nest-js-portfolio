import { Module } from '@nestjs/common'
import { CompactLogger } from './compact-logger.service.js'

@Module({
    providers: [CompactLogger],
    exports: [CompactLogger],
})
export class LoggerModule {}
