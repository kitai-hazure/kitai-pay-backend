import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import * as redisStore from "cache-manager-redis-store";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ProModule } from "./pro/pro.module";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { ENV } from "./constants";
import { ThirdwebModule } from "./thirdweb/thirdweb.module";
import { NotificationModule } from "./notification/notification.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: ENV.REDIS_HOST,
      port: ENV.REDIS_PORT,
      username: ENV.REDIS_USERNAME,
      password: ENV.REDIS_PASSWORD,
      ttl: 5,
      isGlobal: true,
      no_ready_check: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: false,
      autoSchemaFile: join(process.cwd(), "src/schema.graphql"),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      installSubscriptionHandlers: false,
    }),
    MongooseModule.forRoot(ENV.MONGODB_URL),
    ProModule,
    ThirdwebModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
