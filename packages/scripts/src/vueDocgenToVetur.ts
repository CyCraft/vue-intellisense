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
    return props.reduce((carry: any, vueDocgenProp: any) => {
      const { name, description, type: _type, values = [], tags: customTags = {} } = vueDocgenProp
      const attributeName = `${componentNameKebab}/${name}`
      const t = _type?.name || ''
      const type = t.endsWith('[]') ? 'array' : t.replace('func', 'function')

      // get the "options" from string literals
      const _typeTags = customTags.type || []
      const typeTags = _typeTags.map((t: any) => t.type.name)
      const valuesCalculated = values.length
        ? values
        : typeTags.length
        ? typeTags[0]
            .split('|')
            .map((t: string) => t.trim())
            .filter((t: string) => t[0] === `'` && t[t.length - 1] === `'`)
            .map((t: string) => t.slice(1, -1))
        : []
      const options = valuesCalculated.length ? { options: valuesCalculated } : {}

      return { ...carry, [attributeName]: { type, description, ...options } }
    }, {})
  }
  if (veturFile === 'tags') {
    const props = vueDocgen.props || []
    const attributes = props.map(({ name }: any) => name)
    return { [componentNameKebab]: { attributes, description: vueDocgen.description || '' } }
  }
  throw new Error('[vue-intellisense] wrong args')
}
