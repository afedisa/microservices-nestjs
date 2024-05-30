export const ORGANIZATION_MESSAGE_PATTERNS = {
  CREATE: 'organization.create',
  FIND_ALL: 'organization.findall',
  FIND_BY_ID: 'organization.findbyid',
};

export const ORGANIZATION_INVITATION_MESSAGE_PATTERNS = {
  CREATE: 'organization-invitation.create',
  FIND_BY_ID: 'organization-invitation.findbyid',
  FIND_BY_ACTIVE_CODE: 'organization-invitation.findbyactivecode',
  USE: 'organization-invitation.use',
  UPDATE: 'organization-invitation.update',
  REMOVE: 'organization-invitation.remove',
};

export const ORGANIZATION_MEMBER_MESSAGE_PATTERNS = {
  CREATE: 'organization-member.create',
  FIND_ALL: 'organization-member.findall',
  FIND_BY_USER: 'organization-member.findbyuser',
  REMOVE: 'organization-member.remove',
  is_UNEMPLOYED: 'organization-member.isunemployed',
};
