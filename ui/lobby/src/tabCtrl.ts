import { StoredSelector, Selector } from 'common/selector';
import LobbyController from './ctrl';
import * as xhr from './xhr';
import { AppTab, LobbyTab, GamesTab, EventsTab, Tab } from './interfaces';

export class TabCtrl {
  sel: StoredSelector<AppTab, Selector>;

  set(tab: Tab) {
    console.error('set', this.sel.key, this.sel.has(tab), tab);
    if (this.sel.key === tab || this.sel.value?.key === tab) return;
    if (this.sel.has(tab)) this.sel.set(tab as AppTab);
    else {
      const secondary = [...this.sel.group.values()].find(x => x.has(tab))!;
      this.sel.set(this.sel.keyOf(secondary));
      secondary.set(tab);
    }
    console.log(this.sel.key);
  }

  get primary() {
    return this.sel.key;
  }

  get active() {
    return this.sel.value?.key || 'pools';
  }

  get showingHooks() {
    return this.active === 'real_time' || this.active === 'variant';
  }

  get primaries() {
    return [...this.sel.group.entries()];
  }

  get secondaries() {
    return [...(this.sel.value?.group.entries() ?? [])] as [[Tab, Selector]];
  }

  isShowing(tab: Tab) {
    return this.active === tab || this.primary === tab;
  }

  // TODO: i18n
  constructor(ctrl: LobbyController) {
    const lobbyTab = new (class extends StoredSelector<LobbyTab> {
      select() {
        if (this.key === 'correspondence') xhr.seeks().then(ctrl.setSeeks);
        else ctrl.socket.realTimeIn();
      }
      deselect() {
        if (this.key === 'correspondence') return;
        ctrl.socket.realTimeOut();
        ctrl.data.hooks = [];
      }
    })('lobby.tab', {
      defaultKey: 'real_time',
      name: 'Lobby',
      group: new Map([
        ['real_time', { name: 'Real time' }],
        ['variant', { name: 'Variant' }],
        ['correspondence', { name: 'Correspondence' }],
      ]),
    });
    const gamesTab = new StoredSelector<GamesTab>('games.tab', {
      defaultKey: 'playing',
      name: 'Your games',
      group: new Map([
        ['playing', { name: 'Playing' }],
        ['recent', { name: 'Recent' }],
      ]),
    });
    const eventsTab = new StoredSelector<EventsTab>('events.tab', {
      defaultKey: 'tournaments',
      name: 'Open events',
      group: new Map([
        ['tournaments', { name: 'Tournaments' }],
        ['swiss', { name: 'Swiss' }],
        ['simuls', { name: 'Simuls' }],
      ]),
    });
    this.sel = new StoredSelector<AppTab, Selector>('app.tab', {
      defaultKey: 'pools',
      group: ctrl.me?.isBot
        ? new Map([['games', gamesTab]])
        : new Map([
            ['pools', new Selector({ name: 'Pools' })],
            ['lobby', lobbyTab],
            ['games', gamesTab],
            ['events', eventsTab],
          ]),
    });
  }
}
