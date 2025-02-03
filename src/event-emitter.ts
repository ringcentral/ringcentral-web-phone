class EventEmitter {
  // deno-lint-ignore no-explicit-any
  private listeners = new Map<string, ((...args: any[]) => void)[]>();

  // This is used to store temporary listeners that are only called once
  // deno-lint-ignore no-explicit-any
  private tempListeners = new Map<string, ((...args: any[]) => void)[]>();

  // deno-lint-ignore no-explicit-any
  public on(eventName: string, listener: (...args: any[]) => void) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  // deno-lint-ignore no-explicit-any
  public once(eventName: string, listener: (...args: any[]) => void) {
    if (!this.tempListeners.has(eventName)) {
      this.tempListeners.set(eventName, []);
    }
    this.tempListeners.get(eventName)!.push(listener);
  }

  // deno-lint-ignore no-explicit-any
  public off(eventName: string, listener: (...args: any[]) => void) {
    let list = this.listeners.get(eventName);
    if (list) {
      this.listeners.set(
        eventName,
        list.filter((l) => l !== listener),
      );
    }
    list = this.tempListeners.get(eventName);
    if (list) {
      this.tempListeners.set(
        eventName,
        list.filter((l) => l !== listener),
      );
    }
  }

  // deno-lint-ignore no-explicit-any
  public emit(eventName: string, ...args: any[]) {
    (this.listeners.get(eventName) ?? []).forEach((listener) =>
      listener(...args)
    );
    (this.tempListeners.get(eventName) ?? []).forEach((listener) =>
      listener(...args)
    );
    this.tempListeners.delete(eventName);
  }

  public removeAllListeners() {
    this.listeners.clear();
    this.tempListeners.clear();
  }
}

export default EventEmitter;
