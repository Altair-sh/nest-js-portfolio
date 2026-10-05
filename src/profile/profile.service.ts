import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { DateModel, Profile } from './profile.models.js'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfile(): Promise<Profile> {
        const profile = await this.prisma.profile.findFirstOrThrow({
            include: {
                links: true,
                skills: { orderBy: [{ level: 'desc' }, { id: 'asc' }] },
                projects: true,
                experience: { orderBy: { startDate: 'desc' } },
                education: true,
            },
        })

        return {
            ...profile,
            experience: profile.experience.map((job) => ({
                ...job,
                startDate: DateModel.fromDate(job.startDate),
                endDate: job.endDate ? DateModel.fromDate(job.endDate) : null,
            })),
        }
    }
}
