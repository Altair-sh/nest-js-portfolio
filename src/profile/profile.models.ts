import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SkillLevel } from '../generated/prisma/enums.js'

registerEnumType(SkillLevel, { name: 'SkillLevel' })

// GraphQL has no built-in date type and i don't want to install a package for it
@ObjectType('Date', { description: 'date in UTC timezone' })
export class DateModel {
    @Field(() => Int)
    year: number

    @Field(() => Int)
    month: number

    @Field(() => Int)
    day: number

    static fromDate(date: Date): DateModel {
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate(),
        }
    }
}

@ObjectType()
export class Link {
    @Field()
    label: string

    @Field()
    url: string
}

@ObjectType()
export class Skill {
    @Field()
    name: string

    @Field(() => SkillLevel)
    level: SkillLevel
}

@ObjectType()
export class Experience {
    @Field()
    company: string

    @Field()
    position: string

    @Field(() => String, { nullable: true })
    description: string | null

    @Field(() => DateModel)
    startDate: DateModel

    @Field(() => DateModel, {
        nullable: true,
        description: 'null means this is the current job',
    })
    endDate: DateModel | null
}

@ObjectType()
export class Project {
    @Field()
    name: string

    @Field(() => String, { nullable: true })
    description: string | null

    @Field(() => String, { nullable: true })
    url: string | null

    @Field(() => [String])
    technologies: string[]
}

@ObjectType()
export class Education {
    @Field()
    label: string

    @Field()
    place: string

    @Field(() => Int)
    year: number

    @Field(() => String, { nullable: true })
    certificateUrl: string | null
}

@ObjectType()
export class Profile {
    @Field()
    name: string

    @Field()
    headline: string

    @Field(() => String, { nullable: true })
    description: string | null

    @Field(() => [Link])
    links: Link[]

    @Field(() => [Skill])
    skills: Skill[]

    @Field(() => [Experience])
    experience: Experience[]

    @Field(() => [Project])
    projects: Project[]

    @Field(() => [Education])
    education: Education[]
}
