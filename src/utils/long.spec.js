const JSBI = require('jsbi')
const Long = require('./long')

const max = new Long(JSBI.BigInt('9223372036854775807')) // max signed int 64

describe('Utils > Long', () => {
  describe('Converters', () => {
    it('fromString(str)', () => {
      const nativeOutput = Long.fromString('9007199254740991')
      expect(nativeOutput).toEqual({ value: JSBI.BigInt('9007199254740991') })
      expect(nativeOutput.value instanceof JSBI).toEqual(true)
    })

    it('toString()', () => {
      const output = new Long(BigInt(10))
      const expectedString = output.toString()
      expect(expectedString).toEqual('10')
      expect(typeof expectedString).toEqual('string')
    })

    it('fromNumber(value)', () => {
      // number
      const numberOutput = Long.fromNumber(12)
      expect(numberOutput).toEqual({ value: JSBI.BigInt('12') })
      expect(numberOutput.value instanceof JSBI).toEqual(true)

      // string
      const stringOutput = Long.fromNumber('12')
      expect(stringOutput).toEqual({ value: JSBI.BigInt('12') })
      expect(stringOutput.value instanceof JSBI).toEqual(true)

      // Long
      const longOutput = new Long(JSBI.BigInt(12))
      expect(longOutput).toEqual({ value: JSBI.BigInt('12') })
      expect(longOutput.value instanceof JSBI).toEqual(true)
    })

    it('fromValue(value)', () => {
      const output = Long.fromNumber(12)
      expect(output).toEqual({ value: JSBI.BigInt('12') })
      expect(output.value instanceof JSBI).toEqual(true)
    })

    it('fromInt(value)', () => {
      const output = Long.fromInt(12)
      expect(output).toEqual({ value: JSBI.BigInt('12') })
      expect(output.value instanceof JSBI).toEqual(true)
    })

    describe('toInt()', () => {
      it('should return an int', () => {
        const maxInt32 = 2 ** 31 - 1
        const expectedInt = new Long(JSBI.BigInt(maxInt32)).toInt()
        expect(expectedInt).toEqual(2147483647)
        expect(typeof expectedInt).toEqual('number')
      })

      it('should wrap around if the number is too big to be represented as an int32', () => {
        const maxInt32 = 2 ** 31 - 1
        const expectedInt = new Long(JSBI.BigInt(maxInt32 + 1)).toInt()
        expect(expectedInt).toEqual(-2147483648)
        expect(typeof expectedInt).toEqual('number')
      })
    })

    it('toNumber()', () => {
      const expectedNumber = max.toNumber()
      expect(expectedNumber).toEqual(9223372036854776000)
      expect(typeof expectedNumber).toEqual('number')
    })

    describe('toJSON()', () => {
      it('should return a string', () => {
        const serialized = max.toJSON()

        expect(serialized).toEqual('9223372036854775807')
      })
    })
  })

  describe('Operators', () => {
    let input1, input2
    beforeAll(() => {
      input1 = new Long(JSBI.BigInt(5))
      input2 = new Long(JSBI.BigInt(13))
    })

    describe('Bitwise', () => {
      it('AND', () => {
        const output = input1.and(input2)
        expect(output).toEqual({ value: JSBI.BigInt('5') })
      })

      it('OR', () => {
        const output = input1.or(input2)
        expect(output).toEqual({ value: JSBI.BigInt('13') })
      })

      it('XOR', () => {
        const output = input1.xor(input2)
        expect(output).toEqual({ value: JSBI.BigInt('8') })
      })

      it('NOT', () => {
        const output = input1.not()
        expect(output).toEqual({ value: JSBI.BigInt('-6') })
      })

      it('Left shift', () => {
        const output = input1.shiftLeft(1)
        expect(output).toEqual({ value: JSBI.BigInt('10') })
      })

      it('Right shift', () => {
        const output = input1.shiftRight(1)
        expect(output).toEqual({ value: JSBI.BigInt('2') })
      })

      it('Right shift unsigned', () => {
        const output = input1.shiftRightUnsigned(1)
        expect(output).toEqual({ value: JSBI.BigInt('2') })
      })
    })

    describe('Others', () => {
      it('ADD', () => {
        const output = input1.add(input2)
        expect(output).toEqual({ value: JSBI.BigInt('18') })
      })

      it('subtract', () => {
        const output = input1.subtract(input2)
        expect(output).toEqual({ value: JSBI.BigInt('-8') })
      })

      it('Equal', () => {
        const expectFalse = input1.equals(input2)
        expect(expectFalse).toEqual(false)

        const expectTrue = input1.equals(input1)
        expect(expectTrue).toEqual(true)
      })

      it('Not equal', () => {
        const expectFalse = input1.notEquals(input2)
        expect(expectFalse).toEqual(true)

        const expectTrue = input1.notEquals(input1)
        expect(expectTrue).toEqual(false)
      })

      it('NEGATE', () => {
        const output = input1.negate()
        expect(output).toEqual({ value: JSBI.BigInt('-5') })
      })
    })
  })

  describe('Other functions', () => {
    let input1, input2
    beforeAll(() => {
      input1 = new Long(JSBI.BigInt(5))
      input2 = new Long(JSBI.BigInt(13))
    })

    it('getHighBits() & getLowBits()', () => {
      expect(input1.getHighBits()).toEqual(0)
      expect(input1.getLowBits()).toEqual(5)

      expect(input2.getHighBits()).toEqual(0)
      expect(input2.getLowBits()).toEqual(13)

      // 128
      const input = new Long(JSBI.BigInt('128'))

      expect(input.getHighBits()).toEqual(0)
      expect(max.getLowBits()).toEqual(-1)
    })

    it('isZero()', () => {
      expect(input1.isZero()).toEqual(false)
      const zero = new Long(JSBI.BigInt(0))
      expect(zero.isZero()).toEqual(true)
    })

    it('isNegative()', () => {
      expect(new Long(JSBI.BigInt(-15)).isNegative()).toEqual(true)
      expect(new Long(JSBI.BigInt(2)).isNegative()).toEqual(false)
    })

    it('multiply()', () => {
      const mult = input1.multiply(input2)
      expect(mult).toEqual({ value: JSBI.BigInt('65') })
      expect(mult.value instanceof JSBI).toEqual(true)
    })

    it('divide()', () => {
      const divide = input2.divide(input1)
      expect(divide).toEqual({ value: JSBI.BigInt('2') })
      expect(divide.value instanceof JSBI).toEqual(true)
    })

    it('compare()', () => {
      expect(input2.compare(input1)).toEqual(1)
      expect(input1.compare(input2)).toEqual(-1)
      expect(input1.compare(input1)).toEqual(0)
    })

    it('lessThan()', () => {
      expect(input2.lessThan(input1)).toEqual(false)
      expect(input1.lessThan(input2)).toEqual(true)
    })

    it('greaterThanOrEqual()', () => {
      expect(input1.greaterThanOrEqual(input2)).toEqual(false)
      expect(input1.greaterThanOrEqual(input1)).toEqual(true)
      expect(input2.greaterThanOrEqual(input1)).toEqual(true)
    })
  })
})
