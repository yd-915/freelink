import { access, constants, copy, ensureDir } from 'fs-extra'
import { dirname, join } from 'path'

const getRootDir = async () => {
  for (const path of module.paths) {
    try {
      let possibleDir = dirname(path)
      await access(path, constants.F_OK)
      return possibleDir
    } catch (e) {}
  }
  return undefined
}

export const createDirs = async () => {
  const rootDir = await getRootDir()
  if (!rootDir) throw new Error("Can't find the root directory, aborting")

  const srcDir = join(rootDir, 'src')
  const dataDir = join(rootDir, 'src', 'data')
  const assetsDir = join(rootDir, 'src', 'assets')
  const templatesDir = join(rootDir, 'src', 'templates')
  const themesDir = join(rootDir, 'src', 'themes')
  const resourcesDir = join(rootDir, 'resources')
  const distDir = join(rootDir, 'dist')

  await ensureDir(resourcesDir)
  await ensureDir(distDir)

  await copy(assetsDir, join(resourcesDir, 'assets'), { recursive: true })
  await copy(themesDir, join(resourcesDir, 'assets'), {
    recursive: true,
  })

  return {
    srcDir,
    dataDir,
    assetsDir,
    themesDir,
    templatesDir,
    resourcesDir,
    distDir,
  }
}

export type Directories = Awaited<ReturnType<typeof createDirs>>
