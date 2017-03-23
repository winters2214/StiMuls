import { Action } from "./action"
import { ActionSet } from "./action_set"
import { Context } from "./context"
import { EventSet } from "./event_set"

interface EventWithTargetPath extends Event {
  composedPath?(): EventTarget[]
  path?: EventTarget[]
}

export class Dispatcher {
  context: Context
  started: boolean

  private directActions: ActionSet
  private delegatedActions: ActionSet
  private events: EventSet

  constructor(context: Context) {
    this.context = context
    this.started = false

    this.directActions = new ActionSet()
    this.delegatedActions = new ActionSet()
    this.events = new EventSet()

    this.handleDirectEvent = this.handleDirectEvent.bind(this)
    this.handleDelegatedEvent = this.handleDelegatedEvent.bind(this)
  }

  start() {
    if (!this.started) {
      this.started = true
      this.addEventListeners()
    }
  }

  stop() {
    if (this.started) {
      this.removeEventListeners()
      this.started = false
    }
  }

  // Action registration

  addAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (!actionSet.has(action)) {
      this.addEventListenerForAction(action)
      actionSet.add(action)
    }
  }

  removeAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (actionSet.has(action)) {
      this.removeEventListenerForAction(action)
      actionSet.delete(action)
    }
  }

  private getActionSetForAction(action: Action) {
    return action.isDirect ? this.directActions : this.delegatedActions
  }

  // Event listeners

  private addEventListeners() {
    this.addEventListenersForActionSet(this.directActions)
    this.addEventListenersForActionSet(this.delegatedActions)
  }

  private removeEventListeners() {
    this.removeEventListenersForActionSet(this.delegatedActions)
    this.removeEventListenersForActionSet(this.directActions)
  }

  private addEventListenersForActionSet(actionSet: ActionSet) {
    for (const action of actionSet.actions) {
      this.addEventListenerForAction(action)
    }
  }

  private removeEventListenersForActionSet(actionSet: ActionSet) {
    for (const action of actionSet.actions) {
      this.removeEventListenerForAction(action)
    }
  }

  private addEventListenerForAction(action: Action) {
    if (this.started) {
      const eventListener = this.getEventListenerForAction(action)
      this.events.add(action.eventName, action.eventTarget, eventListener, false)
    }
  }

  private removeEventListenerForAction(action: Action) {
    if (this.started) {
      const eventListener = this.getEventListenerForAction(action)
      this.events.delete(action.eventName, action.eventTarget, eventListener, false)
    }
  }

  private getEventListenerForAction(action: Action): EventListener {
    return action.isDirect ? this.handleDirectEvent : this.handleDelegatedEvent
  }

  private handleDirectEvent(event: Event) {
    if (this.canHandleEvent(event)) {
      const actions = this.findDirectActionsForEvent(event)
      performActionsWithEvent(actions, event)
    }
  }

  private handleDelegatedEvent(event: Event) {
    if (this.canHandleEvent(event)) {
      const actions = this.findDelegatedActionsForEvent(event)
      performActionsWithEvent(actions, event)
    }
  }

  private canHandleEvent(event: Event): boolean {
    const element = getTargetElementForEvent(event)
    if (element) {
      return this.context.canControlElement(element)
    } else {
      return true
    }
  }

  private findDirectActionsForEvent(event: Event): Action[] {
    const actions = this.directActions.getActionsForEventName(event.type)
    return actions.filter(action => action.eventTarget == event.currentTarget)
  }

  private findDelegatedActionsForEvent(event: Event): Action[] {
    const actions = this.delegatedActions.getActionsForEventName(event.type)
    const eventTargets = this.getComposedPathForEvent(event)
    return eventTargets.reduce((delegatedActions, eventTarget) => {
      return delegatedActions.concat(actions.filter(action => action.matchDelegatedTarget(eventTarget)))
    }, <Action[]> [])
  }

  private getComposedPathForEvent(event: Event): EventTarget[] {
    const eventTargets: EventTarget[] = []
    const targetPath = getTargetPathForEvent(event)
    if (targetPath) {
      for (const eventTarget of targetPath) {
        eventTargets.push(eventTarget)
        if (eventTarget == this.element) {
          break
        }
      }
    } else {
      let element = getTargetElementForEvent(event)
      while (element && element != this.parentElement) {
        eventTargets.push(element)
        element = element.parentElement
      }
    }
    return eventTargets
  }

  private get element() {
    return this.context.element
  }

  private get parentElement() {
    return this.context.parentElement
  }
}

function performActionsWithEvent(actions: Action[], event: Event) {
  for (const action of actions) {
    action.performWithEvent(event)
  }
}

function getTargetPathForEvent(event: EventWithTargetPath): EventTarget[] | null {
  if (typeof event.composedPath == "function") {
    return event.composedPath()
  } else if (typeof event.deepPath == "function") {
    return event.deepPath()
  } else if (event.path instanceof Array) {
    return event.path
  } else {
    return null
  }
}

function getTargetElementForEvent(event: Event): Element | null {
  const target = event.target
  if (target instanceof Element) {
    return target
  } else if (target instanceof Node) {
    return target.parentElement
  } else {
    return null
  }
}
