
export const permissions = {
    // Admin / General
    ACCESS_ADMIN: 'canAccessAdmin',
    HIDDEN_NOTES: 'canHandleHiddenInformation',
    // Account Management
    ACCESS_ACCOUNT_MANAGER: 'canAccessAccountManager',
    ACCESS_ROLES_LIST: 'canAccessRolesList',
    CREATE_ACCOUNT: 'canCreateAccount',
    DELETE_ACCOUNT: 'canDeleteAccount',
    UPDATE_ACCOUNT: 'canUpdateAccount',
    DELETE_OWN_ACCOUNT: 'canDeleteOwnAccount',
    UPDATE_OWN_ACCOUNT: 'canUpdateOwnAccount',
    // Devices
    ACCESS_DEVICE_LIST: 'canAccessDevicesList',
    EXPORT_DEVICE_LIST: 'canExportDeviceList',
    CREATE_DEVICES: 'canCreateDevices',
    DELETE_DEVICES: 'canDeleteDevices',
    UPDATE_DEVICES: 'canUpdateDevices',
    CREATE_VIRTUAL_DEVICES: 'canCreateVirtualDevices',
    DELETE_VIRTUAL_DEVICES: 'canDeleteVirtualDevices',
    UPDATE_VIRTUAL_DEVICES: 'canUpdateVirtualDevices',
    CHECKOUT_IN_DEVICES: 'canCheckoutInDevices',
    FORCE_CHECKIN_DEVICES: 'canForceCheckinDevices',
    // Manufacturers
    ACCESS_MANUFACTURERS_LIST: 'canAccessManufacturersList',
    CREATE_MANUFACTURER: 'canCreateManufacturer',
    DELETE_MANUFACTURER: 'canDeleteManufacturer',
    UPDATE_MANUFACTURER: 'canUpdateManufacturer',
    // Filesystem
    ACCESS_FILE_MANAGER: 'canAccessFileManager',
    CREATE_FILE_MANAGER_ITEM: 'canCreateFileManagerItem',
    DELETE_FILE_MANAGER_ITEM: 'canDeleteFileManagerItem',
    UPDATE_FILE_MANAGER_ITEM: 'canUpdateFileManagerItem',
    // MSISDN Manager
    ACCESS_MSISDN_MANAGER: 'canAccessMsisdnManager',
    CREATE_MSISDN: 'canCreateMsisdn',
    DELETE_MSISDN: 'canDeleteMsisdn',
    UPDATE_MSISDN: 'canUpdateMsisdn',
    ACCESS_SIM_TYPES: 'canAccessSimTypes',
    // PoolBuilder Management
    ACCESS_POOL_BUILDER: 'canAccessPoolBuilder',
    CREATE_POOL_BUILDER_ITEM: 'canCreatePoolBuilderItem',
    DELETE_POOL_BUILDER_ITEM: 'canDeletePoolBuilderItem',
    UPDATE_POOL_BUILDER_ITEM: 'canUpdatePoolBuilderItem',
    // Links
    CREATE_LINKS: 'canCreateLinks',
    DELETE_LINKS: 'canDeleteLinks',
    UPDATE_LINKS: 'canUpdateLinks',
    // GuideMe
    ACCESS_GUIDE_ME_MANAGER: 'canAccessGuideMeManager',
    MANAGE_GUIDES: 'canManageGuides',
    ACCESS_GUIDES: 'canAccessGuides',
    CREATE_GUIDES: 'canCreateGuides',
    DELETE_GUIDES: 'canDeleteGuides',
    UPDATE_GUIDES: 'canUpdateGuides',
}

export const roles = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
    GUEST: 'GUEST'
}

export const rolePermissions = {
    [roles.ADMIN]: Object.values(permissions),
    [roles.MANAGER]: [
        permissions.ACCESS_DEVICE_LIST,

        permissions.DELETE_OWN_ACCOUNT,
        permissions.UPDATE_OWN_ACCOUNT,
        permissions.CREATE_VIRTUAL_DEVICES,
        permissions.UPDATE_VIRTUAL_DEVICES,
        permissions.DELETE_VIRTUAL_DEVICES,
        permissions.CHECKOUT_IN_DEVICES,
        permissions.CREATE_LINKS,
        permissions.DELETE_LINKS,
        permissions.UPDATE_LINKS,

        permissions.ACCESS_ADMIN,
        permissions.ACCESS_MANUFACTURERS_LIST,
        permissions.CREATE_MANUFACTURER,
        permissions.DELETE_MANUFACTURER,
        permissions.UPDATE_MANUFACTURER,
        permissions.ACCESS_GUIDE_ME_MANAGER,
        permissions.ACCESS_GUIDES,
        permissions.MANAGE_GUIDES,
        permissions.CREATE_GUIDES,
        permissions.DELETE_GUIDES,
        permissions.UPDATE_GUIDES,

        permissions.ACCESS_FILE_MANAGER,
        permissions.CREATE_FILE_MANAGER_ITEM,
        permissions.DELETE_FILE_MANAGER_ITEM,
        permissions.UPDATE_FILE_MANAGER_ITEM,
    ],
    [roles.USER]: [
        permissions.ACCESS_DEVICE_LIST,
        permissions.ACCESS_GUIDES,
        permissions.DELETE_OWN_ACCOUNT,
        permissions.UPDATE_OWN_ACCOUNT,
        permissions.CREATE_VIRTUAL_DEVICES,
        permissions.UPDATE_VIRTUAL_DEVICES,
        permissions.CHECKOUT_IN_DEVICES,
        permissions.CREATE_LINKS,

        permissions.ACCESS_FILE_MANAGER,
        permissions.CREATE_FILE_MANAGER_ITEM,

    ],
    [roles.GUEST]: [
        permissions.ACCESS_DEVICE_LIST,
        permissions.ACCESS_GUIDES,
    ]
}

export class PermissionHandler {
    constructor() {
        this.permissions = permissions
        this.roles = roles
        this.rolePermissions = rolePermissions
    }

    getPermissions(userRoles) {
        if (!userRoles) return new Map();
        userRoles = Array.isArray(userRoles) ? userRoles : [userRoles]
        let allPermissions = new Map();

        userRoles.forEach(role => {
            role = role.toUpperCase();
            if (this.rolePermissions[role]) {
                this.rolePermissions[role].forEach(permission => {
                    allPermissions.set(permission, true)
                })
            }
        })

        return allPermissions
    }
}