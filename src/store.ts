import { manage } from 'manate';

import Store from './models/store';

const store = manage(new Store());

export default store;
