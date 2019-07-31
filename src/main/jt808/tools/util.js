export function bcdToString (buffer) {
  let arr = []
  for (let i = 0, j = 0; i < buffer.length; i++) {
    arr[j++] = buffer[i] >>> 4 & 0x0F
    arr[j++] = buffer[i] & 0x0F
  }
  return arr.join('')
}

export function stringToBcd (str) {
  let arr = []
  for (let i = 0, j = 0; i < str.length; i++, j++) {
    arr[j] = str[i] << 4
    i++
    arr[j] = arr[j] | str[i]
  }
  return Buffer.from(arr)
}

export function integerToObject (number) {
  if (Math.floor(number) !== number) {
    number = 0
  }

  return {
    number: number,
    add: function (n) {
      this.number += n
      return this
    },
    toInteger: function () {
      return this.number
    }
  }
}
