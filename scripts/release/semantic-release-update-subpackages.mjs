import { execFileSync } from 'node:child_process';

export default {
  prepare: async (_, context) => {
    const { nextRelease, logger } = context;
    logger.log(`Running local plugin: updating subpackage versions to ${nextRelease.version}`);
    try {
      execFileSync(process.execPath, ['scripts/release/update-subpackage-versions.mjs', nextRelease.version], {
        stdio: 'inherit',
      });
    } catch (err) {
      logger.error('Failed to update subpackage versions:');
      logger.error(err);
      throw err;
    }
  },
};
