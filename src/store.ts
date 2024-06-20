import { manage } from 'manate';

export class Store {
  public count = 0;
}

const store = manage(new Store());

export default store;
