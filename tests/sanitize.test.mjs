import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeDeep } from '../lib/security/sanitize.js'

test('sanitizeDeep strips HTML tags from nested strings', () => {
  const payload = {
    basicInfo: {
      fullName: '  <script>alert(1)</script>  Jane   Doe ',
    },
    customSections: [
      {
        title: '<b>About</b>',
        fields: [{ label: '<i>Skill</i>', value: ' <img src=x onerror=alert(1)> React ' }],
      },
    ],
  }

  const sanitized = sanitizeDeep(payload)
  assert.equal(sanitized.basicInfo.fullName, 'alert(1) Jane Doe')
  assert.equal(sanitized.customSections[0].title, 'About')
  assert.equal(sanitized.customSections[0].fields[0].label, 'Skill')
  assert.equal(sanitized.customSections[0].fields[0].value, 'React')
})
