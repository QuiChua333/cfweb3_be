import { Logger } from '@nestjs/common';
import { envs } from '@/config';
import { initApplication } from '@/index';

async function bootstrap() {
  const logger = new Logger('APP');

  const app = await initApplication();

  await app.listen(envs.port);

  logger.log(`APP is running on port ${envs.port}`);
}
bootstrap();
