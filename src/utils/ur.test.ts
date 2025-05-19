import { expect, test } from 'vitest'
import { CustomURL } from './url'

test('operate http auto convert', () => {
  const urlInstance = new CustomURL('http://some.example/some/path.jpg!lfit_w100_h100')

  console.log('urlInstance', urlInstance)
})
