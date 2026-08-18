import { Global, Module } from '@nestjs/common';
import { QUERY_CLIENT, queryClientProvider } from './query-client.provider';

@Global()
@Module({
  providers: [queryClientProvider],
  exports: [QUERY_CLIENT],
})
export class QueryModule {}
