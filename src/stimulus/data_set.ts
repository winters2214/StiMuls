import { Context } from "./context"

export class DataSet {
  context: Context

  constructor(context: Context) {
    this.context = context
  }

  get element(): Element {
    return this.context.element
  }

  get identifier(): string {
    return this.context.identifier
  }

  get(key: string): string | null {
    key = this.getFormattedKey(key)
    return this.element.getAttribute(key)
  }

  set(key: string, value): string | null {
    key = this.getFormattedKey(key)
    this.element.setAttribute(key, value)
    return this.get(key)
  }

  has(key: string): boolean {
    key = this.getFormattedKey(key)
    return this.element.hasAttribute(key)
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      key = this.getFormattedKey(key)
      this.element.removeAttribute(key)
      return true
    } else {
      return false
    }
  }

  private getFormattedKey(key): string {
    return `data-${this.identifier}-${dasherize(key)}`
  }
}

function dasherize(value) {
  return value.toString().replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`)
}
