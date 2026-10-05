import { CompactLogger } from './compact-logger.service.js'

describe('CompactLogger', () => {
    let output: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        // fixed local time, so the timestamp in the output is predictable
        vi.useFakeTimers()
        // month 0 = january
        vi.setSystemTime(new Date(2026, 0, 30, 0, 0, 0))
        // catch the output instead of printing it
        output = vi.spyOn(process.stdout, 'write').mockReturnValue(true)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it('formats a message without context', () => {
        const logger = new CompactLogger({ colors: false })
        logger.log('hello')
        expect(output).toHaveBeenLastCalledWith(
            '[2026-01-30 00:00:00][INFO]: hello\n'
        )
    })

    it('formats a message with context', () => {
        const logger = new CompactLogger('Main', { colors: false })
        logger.log('hello')
        expect(output).toHaveBeenLastCalledWith(
            '[2026-01-30 00:00:00][Main/INFO]: hello\n'
        )
    })

    it('adds time since the previous message', () => {
        const logger = new CompactLogger('Main', {
            colors: false,
            timestamp: true,
        })
        logger.log('first step')
        vi.advanceTimersByTime(5)
        logger.log('second step')
        expect(output).toHaveBeenLastCalledWith(
            '[2026-01-30 00:00:00][Main/INFO]: second step +5ms\n'
        )
    })
})
