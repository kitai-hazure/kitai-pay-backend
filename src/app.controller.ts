import { Controller, Get, Inject, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }
}
