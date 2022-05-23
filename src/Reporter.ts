import { Assumption } from "./Assumption.js"
import { ClaimResult } from "./Claim.js"
import { Effect } from "./Effect.js"
import { ScriptContext } from "./Example.js"
import { Summary } from "./Summary.js"

export interface Writer {
  writeLine(message: string): void
}

export interface Failure {
  message?: string
  operator?: string
  expected?: any
  actual?: any
  stack?: string
}

export interface Reporter {
  start(): void
  end(summary: Summary): void
  terminate(error: Failure): void

  startBehavior(description: string): void
  endBehavior(): void
  startExample(description?: string): void
  endExample(): void

  recordAssumption<T>(scriptContext: ScriptContext<T>, assumption: Assumption<T>, result: ClaimResult): void
  skipAssumption<T>(assumption: Assumption<T>): void
  
  recordObservation<T>(scriptContext: ScriptContext<T>, effect: Effect<T>, result: ClaimResult): void
  skipObservation<T>(effect: Effect<T>): void
}

export class NullReporter implements Reporter {
  start(): void {}
  end(summary: Summary): void {}
  terminate(error: Failure): void {}
  startBehavior(description: string): void {}
  endBehavior(): void {}
  startExample(description?: string): void {}
  endExample(): void {}
  recordAssumption<T>(scriptContext: ScriptContext<T>, assumption: Assumption<T>, result: ClaimResult): void {}
  skipAssumption<T>(assumption: Assumption<T>): void {}
  recordObservation<T>(scriptContext: ScriptContext<T>, effect: Effect<T>, result: ClaimResult): void {}
  skipObservation<T>(effect: Effect<T>): void {}
}