import { test, expect } from 'vitest'
import { generateVeturFiles } from '../src/index'
import fs from 'fs'

test('h', async () => {
  const input = 'test/helpers'
  const output = 'test/helpers/out'
  await generateVeturFiles(input, output, { recursive: true })
  const outFileContents = {
    attributes: fs.readFileSync('test/helpers/out/attributes.json', 'utf8'),
    tags: fs.readFileSync('test/helpers/out/tags.json', 'utf8'),
  }
  expect(outFileContents.attributes).toEqual(
    `{
  "blitz-form/value": {
    "type": "object",
    "description": "An object with the data of the entire form. The object keys are the ids of the fields passed in the 'schema'.\\n\\nTo be used with \`:value\` or \`v-model\`."
  },
  "BlitzForm/value": {
    "type": "object",
    "description": "An object with the data of the entire form. The object keys are the ids of the fields passed in the 'schema'.\\n\\nTo be used with \`:value\` or \`v-model\`."
  },
  "blitz-form/id": {
    "type": "string",
    "description": "A manually set 'id' of the BlitzForm. This prop is accessible in the \`context\` (as \`formId\`) of any \\"evaluated prop\\" and event.\\n\\nRead more on Evaluated Props in its dedicated page."
  },
  "BlitzForm/id": {
    "type": "string",
    "description": "A manually set 'id' of the BlitzForm. This prop is accessible in the \`context\` (as \`formId\`) of any \\"evaluated prop\\" and event.\\n\\nRead more on Evaluated Props in its dedicated page."
  },
  "blitz-form/schema": {
    "type": "array",
    "description": "This is the heart of your BlitzForm. It's the schema that will defined what fields will be generated."
  },
  "BlitzForm/schema": {
    "type": "array",
    "description": "This is the heart of your BlitzForm. It's the schema that will defined what fields will be generated."
  },
  "blitz-form/actionButtons": {
    "type": "array",
    "description": "Buttons on top of the form that control the 'mode' of the form. The possible pre-made buttons are:\\n- 'edit' a button which puts the form in 'edit' mode & does \`emit('edit')\`\\n- 'cancel' a button which puts the form in 'view' mode & does \`emit('cancel')\`\\n- 'save' a button which puts the form in 'edit' mode & does \`emit('save', {newData, oldData})\`\\n- 'delete' a red button which does \`emit('delete')\`\\n- 'archive' a red button which does \`emit('archive')\`\\n\\nYou can also pass custom buttons with the same schema to generate forms.\\n\\nSee the documentation on \\"Action Buttons\\" for more info.",
    "options": [
      "cancel",
      "save",
      "delete",
      "archive"
    ]
  },
  "BlitzForm/actionButtons": {
    "type": "array",
    "description": "Buttons on top of the form that control the 'mode' of the form. The possible pre-made buttons are:\\n- 'edit' a button which puts the form in 'edit' mode & does \`emit('edit')\`\\n- 'cancel' a button which puts the form in 'view' mode & does \`emit('cancel')\`\\n- 'save' a button which puts the form in 'edit' mode & does \`emit('save', {newData, oldData})\`\\n- 'delete' a red button which does \`emit('delete')\`\\n- 'archive' a red button which does \`emit('archive')\`\\n\\nYou can also pass custom buttons with the same schema to generate forms.\\n\\nSee the documentation on \\"Action Buttons\\" for more info.",
    "options": [
      "cancel",
      "save",
      "delete",
      "archive"
    ]
  },
  "blitz-form/actionButtonDefaults": {
    "type": "object",
    "description": "You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive."
  },
  "BlitzForm/actionButtonDefaults": {
    "type": "object",
    "description": "You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive."
  },
  "blitz-form/actionButtonsPosition": {
    "type": "string",
    "description": "The position of the action buttons.",
    "options": [
      "top",
      "bottom",
      "right",
      "left"
    ]
  },
  "BlitzForm/actionButtonsPosition": {
    "type": "string",
    "description": "The position of the action buttons.",
    "options": [
      "top",
      "bottom",
      "right",
      "left"
    ]
  },
  "blitz-form/validator": {
    "type": "function",
    "description": "A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message."
  },
  "BlitzForm/validator": {
    "type": "function",
    "description": "A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message."
  },
  "blitz-form/columnCount": {
    "type": "number",
    "description": "The amount of columns the form should have.\\n\\nEach field can set a specific 'span' to be able to span multiple columns."
  },
  "BlitzForm/columnCount": {
    "type": "number",
    "description": "The amount of columns the form should have.\\n\\nEach field can set a specific 'span' to be able to span multiple columns."
  },
  "blitz-form/gridGap": {
    "type": "string",
    "description": "The gap between each field in the form."
  },
  "BlitzForm/gridGap": {
    "type": "string",
    "description": "The gap between each field in the form."
  },
  "blitz-form/lang": {
    "type": "object",
    "description": "The text used in the UI, eg. edit/save buttons etc... Pass an object with keys: archive, delete, cancel, edit, save."
  },
  "BlitzForm/lang": {
    "type": "object",
    "description": "The text used in the UI, eg. edit/save buttons etc... Pass an object with keys: archive, delete, cancel, edit, save."
  },
  "blitz-form/mode": {
    "type": "string",
    "description": "The mode represents how fields are rendered\\n- \\"edit\\" or \\"add\\" means they can be interacted with\\n- \\"view\\" means they can't\\n- \\"raw\\" means the fields are not generated, just the raw value inside a div\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).",
    "options": [
      "edit",
      "add",
      "view",
      "raw"
    ]
  },
  "BlitzForm/mode": {
    "type": "string",
    "description": "The mode represents how fields are rendered\\n- \\"edit\\" or \\"add\\" means they can be interacted with\\n- \\"view\\" means they can't\\n- \\"raw\\" means the fields are not generated, just the raw value inside a div\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).",
    "options": [
      "edit",
      "add",
      "view",
      "raw"
    ]
  },
  "blitz-form/labelPosition": {
    "type": "string|function",
    "description": "The position of the label in comparison to the field.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).",
    "options": [
      "top",
      "left"
    ]
  },
  "BlitzForm/labelPosition": {
    "type": "string|function",
    "description": "The position of the label in comparison to the field.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).",
    "options": [
      "top",
      "left"
    ]
  },
  "blitz-form/evaluatedProps": {
    "type": "array",
    "description": "An array with prop names that should be treated as \\"Evaluated Props\\" when passed a function.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "BlitzForm/evaluatedProps": {
    "type": "array",
    "description": "An array with prop names that should be treated as \\"Evaluated Props\\" when passed a function.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "blitz-form/internalLabels": {
    "type": "boolean|undefined",
    "description": "Set to true if the entire form has its own labels and you do not want the BlitzField to show a label.\\n\\nWhen \`true\` subLabels will be passed as a prop called 'hint'.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "BlitzForm/internalLabels": {
    "type": "boolean|undefined",
    "description": "Set to true if the entire form has its own labels and you do not want the BlitzField to show a label.\\n\\nWhen \`true\` subLabels will be passed as a prop called 'hint'.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "blitz-form/internalErrors": {
    "type": "boolean|undefined",
    "description": "Set to true if the entire form has its own error handling. This makes sure it passes on props like \`rules\` and does nothing with them in the BlitzField.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "BlitzForm/internalErrors": {
    "type": "boolean|undefined",
    "description": "Set to true if the entire form has its own error handling. This makes sure it passes on props like \`rules\` and does nothing with them in the BlitzField.\\n\\nThis prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields)."
  },
  "blitz-form/internalErrorsFor": {
    "type": "array",
    "description": "Pass the component names (without \`.vue\`) that have internal error handling. This makes sure it passes on props like \`rules\` and does nothing with them in the BlitzField."
  },
  "BlitzForm/internalErrorsFor": {
    "type": "array",
    "description": "Pass the component names (without \`.vue\`) that have internal error handling. This makes sure it passes on props like \`rules\` and does nothing with them in the BlitzField."
  },
  "test/value": {
    "type": "Record<string, any>",
    "description": "The value!"
  },
  "Test/value": {
    "type": "Record<string, any>",
    "description": "The value!"
  },
  "test-2/value": {
    "type": "string",
    "description": "The value!",
    "options": [
      "a",
      "b"
    ]
  },
  "Test2/value": {
    "type": "string",
    "description": "The value!",
    "options": [
      "a",
      "b"
    ]
  }
}`
  )

  expect(outFileContents.tags).toEqual(
    `{
  "blitz-form": {
    "attributes": [
      "value",
      "id",
      "schema",
      "actionButtons",
      "actionButtonDefaults",
      "actionButtonsPosition",
      "validator",
      "columnCount",
      "gridGap",
      "lang",
      "mode",
      "labelPosition",
      "evaluatedProps",
      "internalLabels",
      "internalErrors",
      "internalErrorsFor"
    ],
    "description": "A BlitzForm"
  },
  "BlitzForm": {
    "attributes": [
      "value",
      "id",
      "schema",
      "actionButtons",
      "actionButtonDefaults",
      "actionButtonsPosition",
      "validator",
      "columnCount",
      "gridGap",
      "lang",
      "mode",
      "labelPosition",
      "evaluatedProps",
      "internalLabels",
      "internalErrors",
      "internalErrorsFor"
    ],
    "description": "A BlitzForm"
  },
  "test": {
    "attributes": [
      "value"
    ],
    "description": "A Test"
  },
  "Test": {
    "attributes": [
      "value"
    ],
    "description": "A Test"
  },
  "test-2": {
    "attributes": [
      "value"
    ],
    "description": "A Test"
  },
  "Test2": {
    "attributes": [
      "value"
    ],
    "description": "A Test"
  }
}`
  )
})
