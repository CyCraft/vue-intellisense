<template>
  <div class="component-name"></div>
</template>

<script>
export default {
  name: 'BlitzForm',
  props: {
    /**
     * An object with the data of the entire form. The object keys are the ids of the fields passed in the 'schema'.
     *
     * To be used with `:value` or `v-model`.
     * @example {name: ''}
     * @category model
     */
    value: { type: Object, default: () => ({}) },
    /**
     * A manually set 'id' of the BlitzForm. This prop is accessible in the `context` (as `formId`) of any "evaluated prop" and event.
     *
     * Read more on Evaluated Props in its dedicated page.
     * @category model
     */
    id: { type: String },
    /**
     * This is the heart of your BlitzForm. It's the schema that will defined what fields will be generated.
     * @example [{id: 'name', label: 'Name', component: 'QInput'}, {id: 'age', label: 'Age', component: 'QInput', type: 'number'}]
     * @category model
     */
    schema: { type: Array, required: true },
    /**
     * Buttons on top of the form that control the 'mode' of the form. The possible pre-made buttons are:
     * - 'edit' a button which puts the form in 'edit' mode & does `emit('edit')`
     * - 'cancel' a button which puts the form in 'view' mode & does `emit('cancel')`
     * - 'save' a button which puts the form in 'edit' mode & does `emit('save', {newData, oldData})`
     * - 'delete' a red button which does `emit('delete')`
     * - 'archive' a red button which does `emit('archive')`
     *
     * You can also pass custom buttons with the same schema to generate forms.
     *
     * See the documentation on "Action Buttons" for more info.
     * @type {('edit'|'cancel'|'save'|'delete'|'archive'|Record<string, any>)[]}
     * @example ['delete', 'cancel', 'edit', 'save']
     * @example [{component: 'BlitzBtn', btnLabel: 'log', events: {click: console.log}}]
     * @category content
     */
    actionButtons: { type: Array, default: () => [] },
    /**
     * You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive.
     * @example {'save': {push: true}, 'delete': {color: 'secondary'}}
     * @category content
     */
    actionButtonDefaults: { type: Object, default: () => ({}) },
    /**
     * The position of the action buttons.
     * @type {'top' | 'bottom' | 'right' | 'left'}
     * @category content
     */
    actionButtonsPosition: {
      type: String,
      default: 'top',
      validator: (prop) => ['top', 'bottom', 'right', 'left'].includes(prop),
    },
    /**
     * A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message.
     * @example (newData, oldData) => newData.pass1 === newData.pass2 || 'passwords don't match'
     * @category behavior
     */
    validator: { type: Function },
    /**
     * The amount of columns the form should have.
     *
     * Each field can set a specific 'span' to be able to span multiple columns.
     * @category style
     */
    columnCount: { type: Number, default: 1 },
    /**
     * The gap between each field in the form.
     * @category style
     */
    gridGap: { type: String, default: '1em' },
    /**
     * The text used in the UI, eg. edit/save buttons etc... Pass an object with keys: archive, delete, cancel, edit, save.
     * @example {cancel: 'キャンセル', edit: '編集', save: '保存'}
     * @category content
     */
    lang: {
      type: Object,
      // when changing the default, do it for both BlitzForm; BlitzField and lang.js
      default: () => ({
        archive: 'Archive',
        delete: 'Delete',
        cancel: 'Cancel',
        edit: 'Edit',
        save: 'Save',
        requiredField: 'Field is required',
        formValidationError: 'There are remaining errors.',
      }),
    },
    // shared props
    /**
     * The mode represents how fields are rendered
     * - "edit" or "add" means they can be interacted with
     * - "view" means they can't
     * - "raw" means the fields are not generated, just the raw value inside a div
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'edit' | 'add' | 'view' | 'raw'}
     * @category state
     */
    mode: {
      type: String,
      default: 'edit',
      validator: (prop) => ['edit', 'add', 'view', 'raw'].includes(prop),
    },
    /**
     * The position of the label in comparison to the field.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'top' | 'left'}
     * @category style
     */
    labelPosition: {
      type: [String, Function],
      default: 'top',
      validator: (prop) => ['top', 'left'].includes(prop),
    },
    /**
     * An array with prop names that should be treated as "Evaluated Props" when passed a function.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string[]}
     * @category behavior
     */
    evaluatedProps: {
      type: Array,
      default: () => [
        'component',
        'showCondition',
        'label',
        'subLabel',
        'required',
        'rules',
        'fieldStyle',
        'fieldClasses',
        'componentStyle',
        'componentClasses',
        'disable',
        'events',
        'lang',
      ],
    },
    /**
     * Set to true if the entire form has its own labels and you do not want the BlitzField to show a label.
     *
     * When `true` subLabels will be passed as a prop called 'hint'.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category behavior
     */
    internalLabels: {
      type: [Boolean, undefined],
      required: false,
      default: undefined,
    },
    /**
     * Set to true if the entire form has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category behavior
     */
    internalErrors: {
      type: [Boolean, undefined],
      required: false,
      default: undefined,
    },
    /**
     * Pass the component names (without `.vue`) that have internal error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     *
     * @type {string[]}
     * @category behavior
     */
    internalErrorsFor: {
      type: Array,
      default: () => ['QInput', 'QSelect', 'QField', 'q-input', 'q-select', 'q-field'],
    },
  },
  computed: {},
  methods: {},
}
</script>
