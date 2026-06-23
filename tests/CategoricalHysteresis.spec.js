import { describe, it } from 'mocha';
import { assert } from 'chai';

import { CategoricalHysteresis } from '../src/CategoricalHysteresis.js';

describe.only('# CategoricalHysteresis', () => {
  [
    [
      {},
      [
        // input, output
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'], // 5a
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'], // 5a / 5b -> favor lastValue
        ['b', 'b'], // 4a / 6b
        ['b', 'b'],
      ]
    ],
    [
      { bufferSize: 2 },
      [
        // input, output
        // favor current value in case of equality
        ['a', 'a'],
        ['b', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['b', 'b'],
      ]
    ],
    [
      { bufferSize: 4 },
      [
        // input, output
        ['a', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['c', 'a'],
        ['b', 'b'],
        ['c', 'b'],
        ['c', 'c'],
      ]
    ],
  ].forEach(([params, testValues], index) => {
    it(`should properly work (${index + 1})`, () => {
      const hysteresis = new CategoricalHysteresis(params);

      testValues.forEach(([input, expected], index) => {
        const result = hysteresis.process(input);
        assert.equal(result, expected, `Failed at index ${index}`);
      });
    });
  });
});
