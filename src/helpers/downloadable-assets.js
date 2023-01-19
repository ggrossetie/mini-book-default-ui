'use strict'

module.exports = ({ data: { root } }) => {
  if (Array.isArray(root.downloadableAssets)) {
    return root.downloadableAssets
  }
  const { page, contentCatalog, siteRootPath } = root
  const keysValue = page && page.attributes && page.attributes['downloadable-asset-keys']
  if (!keysValue) {
    root.downloadableAssets = []
    return []
  }
  const result = keysValue.split(',')
    .map((key) => key.trim())
    .map((key) => {
      const link = page.attributes[`downloadable-asset-${key}-link`]
      const resource = contentCatalog && contentCatalog.resolveResource(link, {
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
      const icon = page.attributes[`downloadable-asset-${key}-icon`] || 'download'
      return {
        title: page.attributes[`downloadable-asset-${key}-title`],
        href,
        icon,
      }
    })
  root.downloadableAssets = result
  return result
}
