export const DEVICE_MESSAGE_PATTERNS = {
  CREATE: 'device.create',
  FIND_ALL: 'device.findall',
  FIND_BY_ID: 'device.findbyid',
};

export const DEVICE_INVITATION_MESSAGE_PATTERNS = {
  CREATE: 'device-invitation.create',
  FIND_BY_ID: 'device-invitation.findbyid',
  FIND_BY_ACTIVE_CODE: 'device-invitation.findbyactivecode',
  USE: 'device-invitation.use',
  UPDATE: 'device-invitation.update',
  REMOVE: 'device-invitation.remove',
};

export const DEVICE_MEMBER_MESSAGE_PATTERNS = {
  CREATE: 'device-member.create',
  FIND_ALL: 'device-member.findall',
  FIND_BY_USER: 'device-member.findbyuser',
  REMOVE: 'device-member.remove',
  is_UNEMPLOYED: 'device-member.isunemployed',
};
