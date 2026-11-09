import { defineNuxtModule } from '@nuxt/kit'

/**
 * i18n 10.6 uses an absolute glob to transform its shared server utilities.
 * Parentheses in a checkout path can stop that glob from matching on Windows.
 * Apply the same server-only rewrite with a literal path check in that case.
 */
export default defineNuxtModule({
  meta: { name: 'portfolio-windows-path-compatibility' },
  setup(_, nuxt) {
    if (!/^[a-z]:/i.test(nuxt.options.rootDir) || !/[()[\]{}]/.test(nuxt.options.rootDir)) {
      return
    }
    nuxt.hook('nitro:config', (config) => {
      config.rollupConfig ||= {}
      const plugin = {
        name: 'portfolio:i18n-windows-paths',
        transform(code: string, id: string) {
          if (!id.replaceAll('\\', '/').includes('/@nuxtjs/i18n/dist/runtime/shared/')) {
            return
          }
          let output = code
            .replaceAll('#build/i18n-options.mjs', '#internal/i18n-options.mjs')
            .replaceAll('#build/i18n-route-resources.mjs', '#internal/i18n-route-resources.mjs')
            .replace(
              /import.+["']#app["'];?/,
              'const __nuxtMock = { runWithContext: async (fn) => await fn() };',
            )
            .replaceAll(/useNuxtApp\(\)/g, '__nuxtMock')
          if (output.includes('useRuntimeConfig()')) {
            output = `import { useRuntimeConfig } from 'nitropack/runtime';\n${output}`
          }
          return output === code ? null : { code: output, map: null }
        },
      }
      const existing = config.rollupConfig.plugins
      config.rollupConfig.plugins = Array.isArray(existing) ? [plugin, ...existing] : [plugin]
    })
  },
})
