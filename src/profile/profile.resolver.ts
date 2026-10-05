import { Query, Resolver } from '@nestjs/graphql'
import { Profile } from './profile.models.js'
import { ProfileService } from './profile.service.js'

@Resolver()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

    @Query(() => Profile)
    profile(): Promise<Profile> {
        return this.profileService.getProfile()
    }
}
