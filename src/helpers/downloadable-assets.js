'use strict'

module.exports = ({ data: { root } }) => {
  if (Array.isArray(root.downloadableAssets)) {
    return root.downloadableAssets
  }
  const { page, contentCatalog, siteRootPath } = root
  if (!contentCatalog) {
    // contentCatalog is undefined in preview/build
    return []
  }
  const keysValue = page && page.attributes && page.attributes['downloadable-asset-keys']
  if (!keysValue) {
    root.downloadableAssets = []
    return []
  }
  const result = keysValue.split(',')
    .map((key) => key.trim())
    .map((key) => {
      const link = page.attributes[`downloadable-asset-${key}-link`]
      const resource = contentCatalog.resolveResource(link, {
        component: page.component.name,
        version: page.version,
        module: page.module,
      }, 'attachment')
      let href
      if (resource) {
        href = siteRootPath + (resource && resource.pub.url)
      } else {
        href = link
      }
      return {
        title: page.attributes[`downloadable-asset-${key}-title`],
        href,
        icon: 'file',
      }
    })
  root.downloadableAssets = result
  return result
}
