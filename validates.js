
export const phone = (text) => {
  return /^1\d{10}$/.test(text)
}

export const email = (text) => {
  return /^([\w_-]\.)*[\w_-]+@[\w_-]+(.[\w_-]+)+$/.test(text)
}

export const idCard = (text) => {
  if (!/^\d{17}(\d|X)$/.test(text)) {
    return false
  }
  const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const lasts = '10X98765432'
  const sum = text.split('')
                  .slice(0, -1)
                  .map(Number)
                  .reduce((sum, ele, index) => sum + ele * coefficients[index], 0)
  const last = lasts[sum % 11]
  return text[text.length - 1] === last
}

export default {
  phone,
  email,
  idCard
}
