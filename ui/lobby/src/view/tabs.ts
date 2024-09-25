import { looseH as h, bind } from 'common/snabbdom';
import LobbyController from '../ctrl';
import { Tab } from '../interfaces';

function tab(ctrl: LobbyController, key: Tab, v: { name?: string }) {
  const myTurnPovsNb = ctrl.data.nowPlaying.filter(p => p.isMyTurn).length;
  return h(
    'span',
    {
      attrs: { role: 'tab' },
      class: {
        active: ctrl.tab.isShowing(key),
        glowing: ctrl.tab.active !== 'pools' && key === 'pools' && !!ctrl.poolMember,
      },
      hook: bind('mousedown', _ => ctrl.setTab(key), ctrl.redraw),
    },
    [
      v.name,
      key === 'games' && myTurnPovsNb > 0 && h('i.unread', myTurnPovsNb >= 99 ? '99+' : String(myTurnPovsNb)),
    ],
  );
}

export default function(ctrl: LobbyController) {
  console.log(ctrl.tab.active);
  return [
    h(
      'div.tabs-horiz',
      { attrs: { role: 'tablist' } },
      ctrl.tab.primaries.map(([k, v]) => tab(ctrl, k, v)),
    ),
    ctrl.tab.active === 'pools' || (ctrl.tab.primary === 'games' && ctrl.data.nbNowPlaying === 0)
      ? null
      : h(
        'div.tabs-horiz.secondary-tabs',
        { attrs: { role: 'tablist' } },
        ctrl.tab.secondaries.map(([k, v]) => tab(ctrl, k, v)),
      ),
  ];
}
