export const SERVICE_MESSAGE_PATTERNS = {
  CREATE: 'service.create',
  FIND_ALL: 'service.findall',
  FIND_BY_ID: 'service.findbyid',
};

export const SERVICE_INVITATION_MESSAGE_PATTERNS = {
  CREATE: 'service-invitation.create',
  FIND_BY_ID: 'service-invitation.findbyid',
  FIND_BY_ACTIVE_CODE: 'service-invitation.findbyactivecode',
  USE: 'service-invitation.use',
  UPDATE: 'service-invitation.update',
  REMOVE: 'service-invitation.remove',
};

export const SERVICE_MEMBER_MESSAGE_PATTERNS = {
  CREATE: 'service-member.create',
  FIND_ALL: 'service-member.findall',
  FIND_BY_USER: 'service-member.findbyuser',
  REMOVE: 'service-member.remove',
  is_UNEMPLOYED: 'service-member.isunemployed',
};
