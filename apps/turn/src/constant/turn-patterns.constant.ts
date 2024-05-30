export const TURN_MESSAGE_PATTERNS = {
  CREATE: 'turn.create',
  FIND_ALL: 'turn.findall',
  FIND_BY_ID: 'turn.findbyid',
};

export const TURN_INVITATION_MESSAGE_PATTERNS = {
  CREATE: 'turn-invitation.create',
  FIND_BY_ID: 'turn-invitation.findbyid',
  FIND_BY_ACTIVE_CODE: 'turn-invitation.findbyactivecode',
  USE: 'turn-invitation.use',
  UPDATE: 'turn-invitation.update',
  REMOVE: 'turn-invitation.remove',
};

export const TURN_MEMBER_MESSAGE_PATTERNS = {
  CREATE: 'turn-member.create',
  FIND_ALL: 'turn-member.findall',
  FIND_BY_USER: 'turn-member.findbyuser',
  REMOVE: 'turn-member.remove',
  is_UNEMPLOYED: 'turn-member.isunemployed',
};
