import { h, VNodeData } from 'snabbdom';
import { spinnerVdom as spinner } from 'common/spinner';
import renderTabs from './tabs';
import * as renderPools from './pools';
import renderRealTime from './realTime/main';
import renderCorrespondence from './correspondence';
import { renderEvents } from './events';
import renderPlaying from './playing';
import { renderRecent } from './recent';
import LobbyController from '../ctrl';

function renderVariant(ctrl: LobbyController) {
  ctrl;
  return h('div.lobby__variant', []);
}

export default function (ctrl: LobbyController) {
  let body,
    data: VNodeData = {},
    cls: string = String(ctrl.tab.primary);
  if (ctrl.redirecting) body = spinner();
  else
    switch (ctrl.tab.primary) {
      case 'pools':
        body = renderPools.render(ctrl);
        data = { hook: renderPools.hooks(ctrl) };
        break;
      case 'lobby':
        body =
          ctrl.tab.active === 'real_time'
            ? renderRealTime(ctrl)
            : ctrl.tab.active === 'variant'
            ? renderVariant(ctrl)
            : renderCorrespondence(ctrl);
        cls = String(ctrl.tab.active);
        break;
      case 'events':
        body = renderEvents(ctrl);
        break;
      case 'games':
        body =
          ctrl.tab.active === 'playing' && ctrl.data.nbNowPlaying > 0
            ? renderPlaying(ctrl)
            : renderRecent(ctrl);
        break;
    }
  return h('div.lobby__app.lobby__app-' + ctrl.tab.primary, [
    ...renderTabs(ctrl),
    h('div.lobby__app__content.l' + (ctrl.redirecting ? 'redir' : cls), data, body),
  ]);
}
