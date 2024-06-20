class EventEmitter {
  private listeners = new Map<string, Function[]>();

  // This is used to store temporary listeners that are only called once
  private tempListeners = new Map<string, Function[]>();

  public on(eventName: string, listener: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  public once(eventName: string, listener: Function) {
    if (!this.tempListeners.has(eventName)) {
      this.tempListeners.set(eventName, []);
    }
    this.tempListeners.get(eventName)!.push(listener);
  }

  public off(eventName: string, listener: Function) {
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

  public emit(eventName: string, ...args: any[]) {
    (this.listeners.get(eventName) ?? []).forEach((listener) => listener(...args));
    (this.tempListeners.get(eventName) ?? []).forEach((listener) => listener(...args));
    this.tempListeners.delete(eventName);
  }
}

export default EventEmitter;
