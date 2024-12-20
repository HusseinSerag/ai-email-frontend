export class Range<T> {
  start: T
  end: T
  constructor(private range: T[]) {
    if (range.length > 0) {
      this.start = this.range[0]
      this.end = this.range[this.range.length - 1]
    }
    else {
      this.start = this.range[0]
      this.end = this.range[0]
    }
  }

  getRange(middle: number) {
    if (middle < 0 || middle > this.range.length) {
      throw new Error('Invalid middle index')
    }
    if (middle === 0) {
      return this.range.slice(0, 2)
    }
    if (middle === this.range.length - 1) {
      return this.range.slice(this.range.length - 2)
    }
    const prev = middle - 1 >= 0 ? this.range[middle - 1] : this.range[0]
    const current = this.range[middle]
    const next
      = middle + 1 < this.range.length
        ? this.range[middle + 1]
        : this.range[this.range.length - 1]

    return [prev, current, next]
  }
}
