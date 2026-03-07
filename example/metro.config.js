const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const {
  wrapWithReanimatedMetroConfig
} = require('react-native-reanimated/metro-config')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '..')

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules')
    ],
    disableHierarchicalLookup: false
  }
}

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(projectRoot), config)
)
