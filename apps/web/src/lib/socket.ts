import { CLIENT_EVENTS, SERVER_EVENTS } from '@sketchy/shared/contract/socket';

export function getSocketEvents() {
  return { CLIENT_EVENTS, SERVER_EVENTS };
}
