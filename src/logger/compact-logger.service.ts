import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common'
import { styleText } from 'node:util'

type ColorFn = (text: string) => string
const noColor: ColorFn = (text) => text

function createColorizer(format: Parameters<typeof styleText>[0]): ColorFn {
    return (text) => styleText(format, text, { validateStream: false })
}

const colorByLevel: Record<LogLevel, ColorFn> = {
    log: noColor, // terminal's default color
    fatal: createColorizer(['red', 'bold']),
    error: createColorizer('red'),
    warn: createColorizer('yellow'),
    debug: createColorizer('magenta'),
    verbose: createColorizer('gray'),
}

// Output: "[2026-10-04 16:32:40][Context/INFO]: message"
// Without context: "[2026-10-04 16:32:40][INFO]: message"
// TRANSIENT: every consumer gets its own instance, so setContext() calls don't collide
@Injectable({ scope: Scope.TRANSIENT })
export class CompactLogger extends ConsoleLogger {
    // "YYYY-MM-DD HH:mm:ss" in local time
    protected override getTimestamp(): string {
        const d = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
        const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        return `${date} ${time}`
    }

    // brackets are added in formatMessage
    protected override formatContext(context: string): string {
        return context
    }

    protected override formatTimestampDiff(timestampDiff: number): string {
        return ` +${timestampDiff}ms`
    }

    // no coloring of separate parts, formatMessage colorizes the whole line
    protected override colorize(message: string): string {
        return message
    }

    protected override getColorByLogLevel(level: LogLevel): ColorFn {
        return this.options.colors ? colorByLevel[level] : noColor
    }

    protected override formatMessage(
        logLevel: LogLevel,
        message: unknown,
        _pidMessage: string,
        _formattedLogLevel: string,
        context: string,
        timestampDiff: string,
        params?: Record<string, any>
    ): string {
        // "log" is called INFO in most other logging frameworks
        const levelName = logLevel === 'log' ? 'INFO' : logLevel.toUpperCase()
        const context_and_level = context
            ? `${context}/${levelName}`
            : levelName
        const text = this.stringifyMessage(message, logLevel)
        const extra = params ? ` ${this.stringifyParams(params)}` : ''
        const time = this.getTimestamp()
        const line = `[${time}][${context_and_level}]: ${text}${extra}${timestampDiff}`
        // add line break after color reset to avoid visual bugs
        return this.getColorByLogLevel(logLevel)(line) + '\n'
    }
}
