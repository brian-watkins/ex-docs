import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { docReport, FakeReporter, invalidObservation, passingCondition, scenarioReport, validObservation } from './helpers/FakeReporter'
import { document, runDocs, context, example, fact } from '../src/index'
import { expect } from 'chai'

test("it runs a scenario with an async given", async () => {
  const reporter = new FakeReporter()

  await runDocs([
    document("a single test", [
      example("async given", context(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(7), 150)
        })
      }))
        .observations([
          fact("compares the right numbers", (actual) => {
            assert.equal(actual, 7, "it does the thing")
          })
        ])
    ])
  ], { reporter })

  reporter.expectTestReportWith([
    docReport("a single test", [
      scenarioReport("async given", [], [
        validObservation("compares the right numbers")
      ])
    ])
  ], "it prints the expected output for a scenario with an async given")
})

test("it runs a scenario with an async given and async observation", async () => {
  const reporter = new FakeReporter()

  await runDocs([
    document("a single test", [
      example("async given and observation", context(() => {
        return new Promise<number>(resolve => {
          setTimeout(() => resolve(7), 150)
        })
      }))
        .observations([
          fact("async compares the right numbers", async (actual) => {
            const fetchedValue = await new Promise(resolve => {
              setTimeout(() => resolve(actual + 5), 100)
            })
            try {
              expect(fetchedValue).to.equal(15)
            } catch (err) {
              err.stack = "fake stack"
              throw err
            }
          }),
          fact("does something sync", (actual) => {
            assert.equal(actual, 7)
          })
        ])
    ])
  ], { reporter })

  reporter.expectTestReportWith([
    docReport("a single test", [
      scenarioReport("async given and observation", [], [
        invalidObservation("async compares the right numbers", {
          operator: "strictEqual",
          expected: "15",
          actual: "12",
          stack: "fake stack"
        }),
        validObservation("does something sync")
      ])
    ])
  ], "it prints the expected output for a scenario with an async given and async observation")
})

test("it runs async when blocks", async () => {
  const reporter = new FakeReporter()

  await runDocs([
    document("a single test", [
      example("multiple when blocks", context(() => ({ val: 7 })))
        .conditions([
          fact("the value is incremented", (context) => { context.val++ }),
          fact("the value is incremented asynchronously", (context) => {
            return new Promise(resolve => {
              setTimeout(() => {
                context.val++
                resolve()
              }, 150)
            })
          }),
          fact("the value is incremented", (context) => { context.val++ })
        ])
        .observations([
          fact("compares the correct number", (context) => {
            expect(context.val).to.equal(10)
          })
        ])
    ])
  ], { reporter })

  reporter.expectTestReportWith([
    docReport("a single test", [
      scenarioReport("multiple when blocks", [
        passingCondition("the value is incremented"),
        passingCondition("the value is incremented asynchronously"),
        passingCondition("the value is incremented")
      ], [
        validObservation("compares the correct number")
      ])
    ])
  ], "it prints the expected output for a scenario with multiple when blocks")
})

test.run()