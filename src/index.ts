import { Context, ExampleBuilder, BehaviorExampleBuilder, ExampleSetup } from "./Example.js"
import { Reporter } from "./Reporter.js"
import { Behavior, ExampleOptions } from "./Behavior.js"
import { Effect, Observation, Outcome } from "./Observation.js"
import { Fact, Presupposition, Situation } from "./Presupposition.js"
import { StandardReporter } from "./StandardReporter.js"
import { emptySummary, Summary } from "./Summary.js"
import { Action, Procedure, Step } from "./Action.js"
import { Documentation, ValidatableBehavior } from "./Documentation.js"
import { TimerFactory } from "./Timer.js"
import { DefaultOrderProvider, OrderProvider, SeededRandomizer } from "./OrderProvider.js"
export { Effect, Outcome } from "./Observation.js"
export type { Observation } from "./Observation.js"
export { Fact, Situation } from "./Presupposition.js"
export type { Presupposition } from "./Presupposition.js"
export { Procedure, Step } from "./Action.js"
export type { Action } from "./Action.js"
export type { Claim } from "./Claim.js"
export type { OrderProvider } from "./OrderProvider.js"
export { Behavior, ExampleOptions } from "./Behavior.js"
export type { Summary } from "./Summary.js"
export type { Reporter, Writer, Failure } from "./Reporter.js"
export { StandardReporter } from "./StandardReporter.js"
export type { StandardReporterOptions } from "./StandardReporter.js"
export { TAPReporter } from "./TAPReporter.js"
export type { Example, ExampleValidationOptions, Context, ExampleBuilder, ExampleSetup, ExampleScript, ExampleScripts } from "./Example.js"
export type { Script } from "./Script.js"

export interface ValidationOptions {
  reporter?: Reporter,
  order?: OrderProvider,
  failFast?: boolean
}

export async function validate(behaviors: Array<Behavior>, options: ValidationOptions = {}): Promise<Summary> {
  const reporter = options.reporter ?? new StandardReporter()

  const validationOptions = {
    failFast: options.failFast ?? false,
    orderProvider: options.order ?? new SeededRandomizer()
  }

  const validatableBehaviors = behaviors.map(b => new ValidatableBehavior(b, validationOptions))
  const documentation = new Documentation(validatableBehaviors, validationOptions)

  reporter.start(validationOptions.orderProvider.description)

  try {
    const summary = await documentation.validate(reporter)
    reporter.end(summary)
    return summary
  } catch (err: any) {
    reporter.terminate(err)
    return emptySummary()
  }
}

export function defaultOrder(): OrderProvider {
  return new DefaultOrderProvider()
}

export function randomOrder(seed?: string): OrderProvider {
  return new SeededRandomizer(seed)
}

export type ConfigurableExample = ((model: ExampleOptions) => ExampleBuilder<any>) | ExampleBuilder<any>

export function behavior(description: string, examples: Array<ConfigurableExample>): Behavior {
  return new Behavior(description, examples)
}

const voidContext: Context<any> = { init: () => {} }

export function example<T = void>(context: Context<T> = voidContext): ExampleSetup<T> {
  return new BehaviorExampleBuilder(context)
}

export function fact<T>(description: string, validate: (context: T) => void | Promise<void>): Presupposition<T> {
  return new Fact(description, validate, TimerFactory.newTimer())
}

export function situation<T>(descripion: string, presuppositions: Array<Presupposition<T>>): Presupposition<T> {
  return new Situation(descripion, presuppositions)
}

export function step<T>(description: string, validate: (context: T) => void | Promise<void>): Action<T> {
  return new Step(description, validate, TimerFactory.newTimer())
}

export function procedure<T>(descripion: string, steps: Array<Action<T>>): Action<T> {
  return new Procedure(descripion, steps)
}

export function effect<T>(description: string, validate: (context: T) => void | Promise<void>): Observation<T> {
  return new Effect(description, validate, TimerFactory.newTimer())
}

export function outcome<T>(description: string, effects: Array<Observation<T>>): Observation<T> {
  return new Outcome(description, effects)
}