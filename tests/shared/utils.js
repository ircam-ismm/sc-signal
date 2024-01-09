import { assert } from 'chai';

export function assertWithin(value, valueMin, valueMax, message) {
  assert.isAtLeast(value, valueMin, `${message} min`);
  assert.isAtMost(value, valueMax, `${message} max`);
}

export function assertWithRelativeError(value, valueExpected, relativeError,
                                        message) {
  assert.isAtLeast(value, valueExpected - Math.abs(value) * relativeError,
                   `${message} min`);
  assert.isAtMost(value, valueExpected + Math.abs(value) * relativeError,
                  `${message} max`);
}
