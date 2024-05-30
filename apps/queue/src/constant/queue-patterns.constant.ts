export const QUEUE_MESSAGE_PATTERNS = {
  CREATE: 'queue.create',
  FIND_ALL: 'queue.findall',
  FIND_BY_ID: 'queue.findbyid',
};

export const QUEUE_INVITATION_MESSAGE_PATTERNS = {
  CREATE: 'queue-invitation.create',
  FIND_BY_ID: 'queue-invitation.findbyid',
  FIND_BY_ACTIVE_CODE: 'queue-invitation.findbyactivecode',
  USE: 'queue-invitation.use',
  UPDATE: 'queue-invitation.update',
  REMOVE: 'queue-invitation.remove',
};

export const QUEUE_MEMBER_MESSAGE_PATTERNS = {
  CREATE: 'queue-member.create',
  FIND_ALL: 'queue-member.findall',
  FIND_BY_USER: 'queue-member.findbyuser',
  REMOVE: 'queue-member.remove',
  is_UNEMPLOYED: 'queue-member.isunemployed',
};
