import { Module } from '@nestjs/common'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import * as gql from 'graphql'
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
                                description
                                skills { name }
                                experience { company position }
                                projects { name }
                            }
                        }`)
                    ),
                }),
            ],
        }),
    ],
})
export class AppModule {}
