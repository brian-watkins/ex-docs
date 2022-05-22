import { expect } from "chai"
import { behavior, condition, effect, example, step } from "../../src/index.js"

export default behavior("multiple scripts", [
  example({ init: () => ({ touched: 0 }) })
    .description("first script fails")
    .script({
      prepare: [
        condition("it touches the context", (context) => { context.touched++ })
      ],
      observe: [
        effect("the context was touched", (context) => {
          expect(context.touched).to.equal(1)
        })
      ]
    })
    .andThen({
      prepare: [
        condition("it touches the context again", (context) => { context.touched++ })
      ],
      perform: [
        step("it touches the context again", (context) => { context.touched++ })
      ],
      observe: [
        effect("the second script fails", (context) => {
          throw {
            expected: "something",
            actual: "nothing",
            operator: "equals",
            stack: "stack"
          }
        })
      ]
    })
    .andThen({
      prepare: [
        condition("it touches the context another time", (context) => { context.touched++ })
      ],
      perform: [
        step("it touches the context for the last time", (context) => { context.touched++ })
      ],
      observe: [
        effect("the second script would fail if not skipped", (context) => {
          expect(context.touched).to.equal(888)
        })
      ]
    })
])
