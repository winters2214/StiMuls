import Controller from "./controller"

export default class extends Controller {
  checkAll(event) {
    for (const element of this.targets.findAll("checkbox")) {
      element.checked = true
    }
  }

  uncheckAll(event) {
    for (const element of this.targets.findAll("checkbox")) {
      element.checked = false
    }
  }
}
