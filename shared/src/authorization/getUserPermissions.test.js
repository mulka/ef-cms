import { ROLE_PERMISSIONS } from './authorizationClientService';
import { User } from '../business/entities/User';
import { getUserPermissions } from './getUserPermissions';

describe('getUserPermissions', () => {
  it('returns an object containing ROLE_PERMISSIONS and a boolean value based on the given user role', () => {
    const user = {
      role: User.ROLES.docketClerk,
    };

    const permissions = getUserPermissions(user);
    const permissionsKeys = Object.keys(permissions);
    expect(permissionsKeys.length).toEqual(
      Object.keys(ROLE_PERMISSIONS).length,
    );
    expect(typeof permissions[permissionsKeys[0]]).toEqual('boolean');
  });

  it('returns undefined when a user is not provided', () => {
    const permissions = getUserPermissions();
    expect(permissions).toEqual(undefined);
  });
});
