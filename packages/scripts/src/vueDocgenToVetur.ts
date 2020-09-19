import { kebabCase } from 'case-anything'
import { isFullString } from 'is-what'

export function vueDocgenToVetur(
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
    return props.reduce((carry: any, { name, description, type: _type }: any) => {
      const attributeName = `${componentNameKebab}/${name}`
      const t = _type?.name || ''
      const type = t.endsWith('[]') ? 'array' : t.replace('func', 'function')
      return { ...carry, [attributeName]: { type, description } }
    }, {})
  }
  if (veturFile === 'tags') {
    const props = vueDocgen.props || []
    const attributes = props.map(({ name }: any) => name)
    return { [componentNameKebab]: { attributes, description: vueDocgen.description || '' } }
  }
  throw new Error('[vue-intellisense] wrong args')
}
