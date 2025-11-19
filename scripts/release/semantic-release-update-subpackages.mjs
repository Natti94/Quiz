// Semantic-release plugin that runs during the "prepare" step to update
// subpackage versions. It calls a local script that updates `package.json`
// and `package-lock.json` for the frontend/backend workspaces so the monorepo
// reflects the new release version.
//
// This plugin is local and runs only during prepare; keep it small and
// idempotent.

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
