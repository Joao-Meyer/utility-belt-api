export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  EMPLOYEE = 'EMPLOYEE'
}

export const getRoles = {
  [Role.ADMIN]: [Role.ADMIN],
  [Role.OWNER]: [Role.ADMIN, Role.OWNER],
  [Role.MANAGER]: [Role.ADMIN, Role.OWNER, Role.MANAGER],
  [Role.SUPERVISOR]: [Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPERVISOR],
  [Role.EMPLOYEE]: [Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPERVISOR, Role.EMPLOYEE]
};

export const canChangeRoles: { [key in Role]: Role[] } = {
  [Role.ADMIN]: [Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPERVISOR, Role.EMPLOYEE],
  [Role.OWNER]: [Role.OWNER, Role.MANAGER, Role.SUPERVISOR, Role.EMPLOYEE],
  [Role.MANAGER]: [Role.SUPERVISOR, Role.EMPLOYEE],
  [Role.SUPERVISOR]: [Role.EMPLOYEE],
  [Role.EMPLOYEE]: []
};
