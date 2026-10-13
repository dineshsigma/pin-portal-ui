/*
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build` replaces `environment.ts` with `environment.prod.ts`.
 *
 * Environment tokens are aligned 1:1 with the Spring Boot API profiles:
 *   local | dev | sit | uat | prod
 * Keep this union identical to `spring.profiles.active` on the API side.
 */

export interface EnvironmentConfig {
  production?: boolean;
  baseURL?: string;
}

export type Env = 'local' |  'sit' | 'uat' | 'prod';

const CURRENT_ENV: Env = 'sit';

/**
 * Reads a build-/host-provided environment variable.
 * Returns '' when it is not defined so production config stays blank
 * rather than falling back to a hardcoded value.
 */
function readEnv(key: string): string {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return (proc && proc.env && proc.env[key]) || '';
}

const ENV_CONFIG: Record<Env, EnvironmentConfig> = {
  local: {
    production: false,
    // Relative, not absolute: the PIN-reset flow relies on an HttpOnly session
    // cookie (Step 1 -> Step 2), which only survives locally if the API is called
    // same-origin. `ng serve` proxies this path to the API - see proxy.conf.json.
    baseURL: 'http://localhost:8080/v1/pinportal'
  },
  sit: {
    production: false,
    baseURL: 'https://sitfgapi.lockeralliance.net/v1/pinportal'
  },

  uat: {
    production: false,
    baseURL: 'https://apisandbox.lockeralliance.net/v1/pinportal'
  },

  // Production config is supplied entirely from the environment at build time.
  // Any variable that is not set resolves to '' (blank) - no hardcoded fallback.
  prod: {
    production: true,
    baseURL: readEnv('PINPORTAL_BASE_URL')
  }
};

export const environment = {
  env: CURRENT_ENV,
  ...ENV_CONFIG[CURRENT_ENV]
};
