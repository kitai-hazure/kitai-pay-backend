import { Inject, UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Cache } from "cache-manager";
import { ProService } from "./pro.service";
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from "@nestjs/cache-manager";
import { CACHE_KEYS } from "src/constants";

@Resolver("Pro")
export class ProResolver {
  constructor(
    private readonly proService: ProService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEYS.GET_PRO_CACHE)
  @CacheTTL(10)
  @Query(() => String)
  async getPro(): Promise<string> {
    return this.proService.getPro();
  }

  @Mutation(() => String)
  async setPro(
    @Args("setProInput")
    setProInput: string
  ): Promise<string> {
    return this.proService.setPro(setProInput);
  }
}
