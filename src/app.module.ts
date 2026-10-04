import { Module } from '@nestjs/common'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { AppResolver } from './app.resolver.js'
import { AppService } from './app.service.js'
import * as gql from 'graphql'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            // generate schema.gql in memory
            autoSchemaFile: true,
            // disable NestJS GraphQL playground
            playground: false,
            // enable debug
            introspection: true,
            plugins: [
                ApolloServerPluginLandingPageLocalDefault({
                    embed: true,
                    includeCookies: false,
                    document: gql.print(
                        gql.parse(`query ExampleQuery {
                            hello
                        }`)
                    ),
                }),
            ],
        }),
    ],
    providers: [AppResolver, AppService],
})
export class AppModule {}
