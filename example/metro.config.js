const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const {
  wrapWithReanimatedMetroConfig
} = require('react-native-reanimated/metro-config')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '..')
const packageSourceEntry = path.resolve(monorepoRoot, 'src/index.ts')

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules')
    ],
    disableHierarchicalLookup: false,
    resolveRequest: (context, moduleName, platform) => {
      // Bypass node_modules: resolve directly to source so Metro watches and picks up changes
      if (moduleName === 'react-native-sliding-blocks') {
        return { type: 'sourceFile', filePath: packageSourceEntry }
      }
      if (moduleName.startsWith('react-native-sliding-blocks/')) {
        const subpath = moduleName.slice('react-native-sliding-blocks/'.length)
        const candidate = path.resolve(monorepoRoot, 'src', subpath)
        return { type: 'sourceFile', filePath: candidate }
      }
      return context.resolveRequest(context, moduleName, platform)
    }
  }
}

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(projectRoot), config)
)
