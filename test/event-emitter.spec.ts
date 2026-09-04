import { expect, test } from "@playwright/test";

import EventEmitter from "../src/event-emitter";

test("an ordinary once() callback runs exactly once across repeated emissions", () => {
  const emitter = new EventEmitter();
  const calls: string[] = [];
  emitter.once("event", () => {
    calls.push("one-time");
  });
  emitter.emit("event");
  emitter.emit("event");
  emitter.emit("event");
  expect(calls).toEqual(["one-time"]);
});

test("a once() callback that synchronously emits the same event is invoked exactly once", () => {
  const emitter = new EventEmitter();
  let count = 0;
  emitter.once("event", () => {
    count++;
    emitter.emit("event");
  });
  emitter.emit("event");
  expect(count).toBe(1);
});

test("a re-entrant emission does not re-invoke a consumed one-time registration", () => {
  const emitter = new EventEmitter();
  const calls: string[] = [];
  emitter.on("event", () => {
    calls.push("persistent");
  });
  emitter.once("event", () => {
    calls.push("one-time");
    emitter.emit("event");
  });
  emitter.emit("event");
  expect(calls).toEqual(["persistent", "one-time", "persistent"]);
});

test("a throwing once() callback propagates its original error and remains removed", () => {
  const emitter = new EventEmitter();
  const boom = new Error("boom");
  let count = 0;
  emitter.once("event", () => {
    count++;
    throw boom;
  });
  expect(() => emitter.emit("event")).toThrow(boom);
  expect(count).toBe(1);
  expect(() => emitter.emit("event")).not.toThrow();
  expect(count).toBe(1);
});

test("when an earlier one-time callback throws, later one-time callbacks remain pending and run on the next emission", () => {
  const emitter = new EventEmitter();
  const calls: string[] = [];
  emitter.once("event", () => {
    calls.push("first");
    throw new Error("first failed");
  });
  emitter.once("event", () => {
    calls.push("second");
  });
  expect(() => emitter.emit("event")).toThrow("first failed");
  expect(calls).toEqual(["first"]);
  emitter.emit("event");
  expect(calls).toEqual(["first", "second"]);
});

test("mixed on() and once() callbacks execute synchronously in their overall registration order", () => {
  const emitter = new EventEmitter();
  const calls: string[] = [];
  emitter.on("event", () => {
    calls.push("on-1");
  });
  emitter.once("event", () => {
    calls.push("once-1");
  });
  emitter.on("event", () => {
    calls.push("on-2");
  });
  emitter.once("event", () => {
    calls.push("once-2");
  });
  emitter.emit("event");
  expect(calls).toEqual(["on-1", "once-1", "on-2", "once-2"]);
  // one-time registrations are consumed, persistent ones keep running
  calls.length = 0;
  emitter.emit("event");
  expect(calls).toEqual(["on-1", "on-2"]);
});

test("off() with the original callback prevents a pending one-time callback from running", () => {
  const emitter = new EventEmitter();
  let count = 0;
  const listener = () => {
    count++;
  };
  emitter.once("event", listener);
  emitter.off("event", listener);
  emitter.emit("event");
  expect(count).toBe(0);
});
