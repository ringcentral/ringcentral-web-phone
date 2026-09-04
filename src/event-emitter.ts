// deno-lint-ignore no-explicit-any
type Listener = (...args: any[]) => void;

// One registration of a listener on an event. Persistent and one-time
// listeners share a single list per event so that they are invoked in
// overall registration order.
interface Registration {
  // The original callback. It is what off() matches against, so consumers
  // can remove a registration without knowing about any wrapper.
  listener: Listener;
  // For a one-time registration: the wrapper actually invoked by emit().
  // It consumes the registration before invoking the original callback, so
  // a re-entrant emission cannot invoke it again, and a throwing callback
  // stays removed. Undefined for a persistent registration.
  wrapper?: Listener;
}

class EventEmitter {
  private listeners = new Map<string, Registration[]>();

  public on(eventName: string, listener: Listener) {
    this.getOrCreateList(eventName).push({ listener });
  }

  public once(eventName: string, listener: Listener) {
    const registration: Registration = { listener };
    // deno-lint-ignore no-explicit-any
    registration.wrapper = (...args: any[]) => {
      this.remove(eventName, registration);
      listener(...args);
    };
    this.getOrCreateList(eventName).push(registration);
  }

  public off(eventName: string, listener: Listener) {
    const list = this.listeners.get(eventName);
    if (list) {
      this.listeners.set(
        eventName,
        list.filter((registration) => registration.listener !== listener),
      );
    }
  }

  public emit(eventName: string, ...args: any[]) {
    const list = this.listeners.get(eventName);
    if (!list) {
      return;
    }
    // Iterate a snapshot: listeners may add or remove registrations (or
    // emit re-entrantly) during this emission.
    for (const registration of [...list]) {
      (registration.wrapper ?? registration.listener)(...args);
    }
  }

  public removeAllListeners() {
    this.listeners.clear();
  }

  private getOrCreateList(eventName: string): Registration[] {
    let list = this.listeners.get(eventName);
    if (!list) {
      list = [];
      this.listeners.set(eventName, list);
    }
    return list;
  }

  private remove(eventName: string, registration: Registration) {
    const list = this.listeners.get(eventName);
    if (!list) {
      return;
    }
    const index = list.indexOf(registration);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }
}

export default EventEmitter;
