interface AsyncInterface {

}

interface Polymer_Async_MicroTask {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof Polymer.Async.microTask
   * @param {Function} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(callback: Function): number;

  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof Polymer.Async.microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   */
  cancel(handle: number): void;
}

interface Polymer_Async_IdlePeriod {
  /**
   * Enqueues a function called at `requestIdleCallback` timing.
   *
   * @memberof Polymer.Async.idlePeriod
   * @param {function(IdleDeadline)} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(fn: Function): number;

  /**
   * Cancels a previously enqueued `idlePeriod` callback.
   *
   * @memberof Polymer.Async.idlePeriod
   * @param {number} handle Handle returned from `run` of callback to cancel
   */
  cancel(handle: number): void;
}

interface Polymer_Async_AnimationFrame {
  /**
   * Enqueues a function called at `requestAnimationFrame` timing.
   *
   * @memberof Polymer.Async.animationFrame
   * @param {Function} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(fn: Function): number;

  /**
   * Cancels a previously enqueued `animationFrame` callback.
   *
   * @memberof Polymer.Async.timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   */
  cancel(handle: number): void;
}

interface Polymer_Async_TimeOut {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof Polymer.Async.timeOut
   * @param {number} delay Time to wait before calling callbacks in ms
   * @return {AsyncInterface} An async timeout interface
   */
  after(delay: number): AsyncInterface;

  /**
   * Enqueues a function called in the next task.
   *
   * @memberof Polymer.Async.timeOut
   * @param {Function} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(fn: Function): number;

  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof Polymer.Async.timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   */
  cancel(handle: number): void;
}

interface Polymer_AsyncStatic {
  /**
   * Async interface wrapper around `setTimeout`.
   *
   * @namespace
   * @memberof Polymer.Async
   * @summary Async interface wrapper around `setTimeout`.
   */
  timeOut: Polymer_Async_TimeOut;

  /**
   * Async interface wrapper around `requestAnimationFrame`.
   *
   * @namespace
   * @memberof Polymer.Async
   * @summary Async interface wrapper around `requestAnimationFrame`.
   */
  animationFrame: Polymer_Async_AnimationFrame;

  /**
   * Async interface wrapper around `requestIdleCallback`.  Falls back to
   * `setTimeout` on browsers that do not support `requestIdleCallback`.
   *
   * @namespace
   * @memberof Polymer.Async
   * @summary Async interface wrapper around `requestIdleCallback`.
   */
  idlePeriod: Polymer_Async_IdlePeriod;

  /**
   * Async interface for enqueueing callbacks that run at microtask timing.
   *
   * Note that microtask timing is achieved via a single `MutationObserver`,
   * and thus callbacks enqueued with this API will all run in a single
   * batch, and not interleaved with other microtasks such as promises.
   * Promises are avoided as an implementation choice for the time being
   * due to Safari bugs that cause Promises to lack microtask guarantees.
   *
   * @namespace
   * @memberof Polymer.Async
   * @summary Async interface for enqueueing callbacks that run at microtask
   *   timing.
   */
  microTask: Polymer_Async_MicroTask;
}

interface PolymerStatic {
  /**
   * Module that provides a number of strategies for enqueuing asynchronous
   * tasks.  Each sub-module provides a standard `run(fn)` interface that returns a
   * handle, and a `cancel(handle)` interface for canceling async tasks before
   * they run.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module that provides a number of strategies for enqueuing asynchronous
   * tasks.
   */
  Async: Polymer_AsyncStatic;
}