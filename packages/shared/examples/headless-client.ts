import { createApiClient } from '../src/client.js';

async function main() {
  const client = createApiClient({ baseUrl: 'http://localhost:4000/v1' });
  console.log('ApiClient initialized', client);
}

main().catch(console.error);
