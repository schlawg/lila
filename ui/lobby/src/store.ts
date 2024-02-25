import { LobbyTab, AppTab, Mode, Sort } from './interfaces';

interface Store<A> {
  set(v: string): A;
  get(): A;
}

export interface Stores {
  tab: Store<AppTab>;
  lobbyTab: Store<LobbyTab>;
  mode: Store<Mode>;
  sort: Store<Sort>;
}

interface Config<A> {
  key: string;
  fix(v: string | null): A;
}

const tab: Config<AppTab> = {
  key: 'app.tab',
  fix: (t: string | null) => (t ? (t as AppTab) : 'pools'),
};

const lobbyTab: Config<LobbyTab> = {
  key: 'lobby.tab',
  fix: (t: string | null) => (t ? (t as LobbyTab) : 'real_time'),
};

const mode: Config<Mode> = {
  key: 'lobby.mode',
  fix: (m: string | null) => (m ? (m as Mode) : 'list'),
};
const sort: Config<Sort> = {
  key: 'lobby.sort',
  fix: (s: string | null) => (s ? (s as Sort) : 'rating'),
};

function makeStore<A>(conf: Config<A>, userId?: string): Store<A> {
  const fullKey = conf.key + ':' + (userId || '-');
  return {
    set(v: string): A {
      const t: A = conf.fix(v);
      site.storage.set(fullKey, ('' + t) as string);
      return t;
    },
    get(): A {
      return conf.fix(site.storage.get(fullKey));
    },
  };
}

export function make(userId?: string): Stores {
  return {
    tab: makeStore<AppTab>(tab, userId),
    lobbyTab: makeStore<LobbyTab>(lobbyTab, userId),
    mode: makeStore<Mode>(mode, userId),
    sort: makeStore<Sort>(sort, userId),
  };
}
