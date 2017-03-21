// Generated by dts-bundle v0.7.2
// Dependencies for this module:
//   sentinella

import { TokenListObserverDelegate } from "sentinella";
import { AttributeObserverDelegate } from "sentinella";

export { decorators };

export function on(eventName: string, actionOptions?: ActionOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export type EventTargetMatcher = (eventTarget: EventTarget) => boolean;
export class Action {
    object: Object;
    descriptor: Descriptor;
    eventTarget: EventTarget;
    delegatedTargetMatcher: EventTargetMatcher | null;
    constructor(object: Object, descriptor: Descriptor, eventTarget: EventTarget, delegatedTargetMatcher: EventTargetMatcher);
    readonly eventName: string;
    readonly methodName: string;
    readonly preventsDefault: boolean;
    readonly isDirect: boolean;
    readonly isDelegated: boolean;
    readonly method: Function;
    hasSameDescriptorAs(action: Action | null): boolean;
    matchDelegatedTarget(eventTarget: EventTarget): boolean;
    performWithEvent(event: Event): void;
}

export class Application {
    static start(): Application;
    constructor(router: Router);
    start(): void;
    stop(): void;
    register(identifier: string, controllerConstructor: ControllerConstructor): void;
}

export interface ControllerConstructor {
    new (context: Context): Controller;
}
export interface ActionOptions {
    targetName: string;
}
export class Controller {
    context: Context;
    constructor(context: Context);
    readonly element: Element;
    readonly identifier: string;
    readonly targets: TargetSet;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    addAction(descriptorString: string, options?: ActionOptions | EventTarget): void;
    removeAction(action: Action): void;
}

export interface DescriptorOptions {
    targetName?: string;
    eventName?: string;
    methodName?: string;
    preventsDefault?: boolean;
}
export class Descriptor {
    targetName: string | null;
    eventName: string;
    methodName: string;
    preventsDefault: boolean;
    static forOptions(options: DescriptorOptions): Descriptor;
    static forElementWithInlineDescriptorString(element: Element, descriptorString: string): Descriptor;
    constructor(targetName: string | null, eventName: string, methodName: string, preventsDefault: boolean);
    isEqualTo(descriptor: Descriptor | null): boolean;
    toString(): string;
}

export class Router implements TokenListObserverDelegate, ContextDelegate {
    constructor(element: Element, attributeName: string);
    readonly element: Element;
    start(): void;
    stop(): void;
    register(identifier: string, controllerConstructor: ControllerConstructor): void;
    contextCanControlElement(context: Context, element: Element): boolean;
    elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string): void;
    elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string): void;
}

export interface ContextDelegate {
    contextCanControlElement(context: Context, element: Element): boolean;
}
export class Context implements InlineActionObserverDelegate, TargetSetDelegate {
    identifier: string;
    element: Element;
    delegate: ContextDelegate;
    controller: Controller;
    targets: TargetSet;
    constructor(identifier: string, element: Element, controllerConstructor: ControllerConstructor, delegate: ContextDelegate);
    connect(): void;
    disconnect(): void;
    readonly parentElement: Element | null;
    addAction(action: Action): void;
    removeAction(action: Action): void;
    getObjectForInlineActionDescriptor(descriptor: Descriptor): object;
    inlineActionConnected(action: Action): void;
    inlineActionDisconnected(action: Action): void;
    canControlElement(element: Element): boolean;
}

export interface TargetSetDelegate {
    canControlElement(element: Element): any;
}
export class TargetSet {
    identifier: string;
    element: Element;
    constructor(identifier: string, element: Element, delegate: TargetSetDelegate);
    has(targetName: string): boolean;
    find(targetName: string): Element | null;
    findAll(targetName: string): Element[];
    matchesElementWithTargetName(element: Element, targetName: string): boolean;
}

export interface InlineActionObserverDelegate {
    getObjectForInlineActionDescriptor(descriptor: Descriptor): object;
    inlineActionConnected(action: Action): any;
    inlineActionDisconnected(action: Action): any;
    canControlElement(element: Element): any;
}
export class InlineActionObserver implements AttributeObserverDelegate {
    identifier: string;
    constructor(identifier: string, element: Element, delegate: InlineActionObserverDelegate);
    readonly element: Element;
    readonly attributeName: string;
    start(): void;
    stop(): void;
    elementMatchedAttribute(element: Element, attributeName: string): void;
    elementAttributeValueChanged(element: Element, attributeName: string): void;
    elementUnmatchedAttribute(element: Element, attributeName: string): void;
}

