import { kebabCase } from 'case-anything'
import { isFullString, isPlainObject } from 'is-what'
import { parse } from 'vue-docgen-api'

function vueDocgenToVetur(
  vueDocgen: Record<string, any>,
  veturFile: 'attributes' | 'tags'
): Record<string, any> {
  const componentName = vueDocgen.displayName
  if (!isFullString(componentName)) {
    throw new Error('[vue-intellisense] Component is missing a "name" property.')
  }
  const componentNameKebab = kebabCase(componentName)
  if (veturFile === 'attributes') {
    const props = vueDocgen.props || []
    return props.reduce((carry: any, { name, tags, description, type: _type }: any) => {
      const attributeName = `${componentNameKebab}/${name}`
      const t = _type?.name || ''
      const type = t.endsWith('[]') ? 'array' : t.replace('func', 'function')
      return { ...carry, [attributeName]: { type, description } }
    }, {})
  }
  return {}
}

export async function vueFilePathToVeturJsonData(
  vueFilePath: string,
  veturFile: 'attributes' | 'tags'
): Promise<Record<string, any>> {
  const vueDocgen = await parse(vueFilePath)
  if (!isPlainObject(vueDocgen)) return {}
  const jsonData = vueDocgenToVetur(vueDocgen, veturFile)
  return jsonData
}
