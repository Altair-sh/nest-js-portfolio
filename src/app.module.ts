import { Module } from '@nestjs/common'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import * as gql from 'graphql'
import { IndexController } from './index.controller.js'
import { LoggerModule } from './logger/logger.module.js'
import { ProfileModule } from './profile/profile.module.js'

@Module({
    imports: [
        LoggerModule,
        ProfileModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            // generate schema.gql in memory
            autoSchemaFile: true,
            // disable NestJS GraphQL playground
            playground: false,
            // enable GraphQL resolvers with debug info
            introspection: true,
            plugins: [
                // enable apollo playground on http route GET /graphql
                ApolloServerPluginLandingPageLocalDefault({
                    embed: true,
                    includeCookies: false,
                    document: gql.print(
                        gql.parse(`query ExampleQuery {
                            profile {
                                name
                                headline
                                description
                                links { label url }
                                education { label place year certificateUrl }
                                skills { name level }
                                experience {
                                    company
                                    position
                                    description
                                    startDate { year month day }
                                    endDate { year month day }
                                }
                                projects { name description url technologies }
                            }
                        }`)
                    ),
                }),
            ],
        }),
    ],
    controllers: [IndexController],
})
export class AppModule {}
