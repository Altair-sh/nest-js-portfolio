/*
Config to compile node_modules into a single dist/main.js
Nest by default marks every package as external, which needs to be overwritten here.
*/

import { createRequire } from 'node:module'
import type { Configuration } from '@rspack/core'
import type * as Rspack from '@rspack/core'

const require = createRequire(import.meta.url)

/** @param options Nest default config */
export default (
    options: Configuration,
    rspack: typeof Rspack
): Configuration => ({
    ...options,
    externals: [],
    externalsPresets: { node: true },
    externalsType: 'node-commonjs',
    module: {
        ...options.module,
        // compile dynamic imports in main.js
        parser: { javascript: { dynamicImportMode: 'eager' } },
    },
    plugins: [
        ...(options.plugins ?? []),
        // Nest lazily loads optional packages.
        // The following code skips optional packages that are not installed so rspack doesn't crash while trying to find them.
        new rspack.IgnorePlugin({
            checkResource: (resource, context) => {
                // only imports made by packages
                if (!context.includes('node_modules')) return false

                // only package names, not file paths
                if (resource.startsWith('.') || resource.startsWith('/'))
                    return false

                // skip the import if the package can't be found
                try {
                    require.resolve(resource, { paths: [context] })
                    return false
                } catch (e) {
                    return (
                        (e as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND'
                    )
                }
            },
        }),
    ],
})
