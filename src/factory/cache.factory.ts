import { CacheOptionsFactory, CacheModuleOptions } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";

@Injectable()
class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 1800 * 1000, // 30 minutes default
    };
  }
}

export default CacheConfigService;
