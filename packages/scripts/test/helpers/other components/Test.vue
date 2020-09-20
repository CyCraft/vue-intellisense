<template>
  <div class="component-name"></div>
</template>

<script>
/** A Test */
export default {
  name: 'Test',
  props: {
    /**
     * The value!
     * @type {Record<string, any>}
     * @example {name: ''}
     * @category model
     */
    value: { type: Object, default: () => ({}) },
  },
}
</script>
