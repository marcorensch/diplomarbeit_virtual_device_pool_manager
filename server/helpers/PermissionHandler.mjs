
export const permissions = {
    // Admin
    ACCESS_ADMIN: 'canAccessAdmin',
    // Account Management
    ACCESS_ACCOUNT_LIST: 'canAccessAccountList',
    ACCESS_ROLES_LIST: 'canAccessRolesList',
    CREATE_ACCOUNT: 'canCreateAccount',
    DELETE_ACCOUNT: 'canDeleteAccount',
    UPDATE_ACCOUNT: 'canUpdateAccount',
    DELETE_OWN_ACCOUNT: 'canDeleteOwnAccount',
    UPDATE_OWN_ACCOUNT: 'canUpdateOwnAccount',
    // Devices
    ACCESS_DEVICE_LIST: 'canAccessDeviceList',
    CREATE_DEVICES: 'canCreateDevices',
    DELETE_DEVICES: 'canDeleteDevices',
    UPDATE_DEVICES: 'canUpdateDevices',
    CREATE_VIRTUAL_DEVICES: 'canCreateVirtualDevices',
    DELETE_VIRTUAL_DEVICES: 'canDeleteVirtualDevices',
    UPDATE_VIRTUAL_DEVICES: 'canUpdateVirtualDevices',
    UPDATE_OWN_DEVICES: 'canUpdateOwnDevices',
    DELETE_OWN_DEVICES: 'canDeleteOwnDevices',
    // Numbers
    ACCESS_NUMBER_LIST: 'canAccessNumberList',
    CREATE_NUMBERS: 'canCreateNumbers',
    DELETE_NUMBERS: 'canDeleteNumbers',
    UPDATE_NUMBERS: 'canUpdateNumbers',
    ACCESS_SIM_TYPES: 'canAccessSimTypes',
    // PoolBuilder Management
    ACCESS_POOL_BUILDER: 'canAccessPoolBuilder',
    CREATE_LOCATION: 'canCreateLocation',
    DELETE_LOCATION: 'canDeleteLocation',
    UPDATE_LOCATION: 'canUpdateLocation',
    CREATE_CABINET: 'canCreateCabinet',
    DELETE_CABINET: 'canDeleteCabinet',
    UPDATE_CABINET: 'canUpdateCabinet',
    CREATE_SLOT: 'canCreateSlot',
    DELETE_SLOT: 'canDeleteSlot',
    UPDATE_SLOT: 'canUpdateSlot',
    // Documents
    CREATE_DOCUMENTS: 'canCreateDocuments',
    DELETE_DOCUMENTS: 'canDeleteDocuments',
    UPDATE_DOCUMENTS: 'canUpdateDocuments',
    DELETE_OWN_DOCUMENTS: 'canDeleteOwnDocuments',
    UPDATE_OWN_DOCUMENTS: 'canUpdateOwnDocuments',
    // Images
    CREATE_IMAGES: 'canCreateImages',
    DELETE_IMAGES: 'canDeleteImages',
    UPDATE_IMAGES: 'canUpdateImages',
    // Links
    CREATE_LINKS: 'canCreateLinks',
    DELETE_LINKS: 'canDeleteLinks',
    UPDATE_LINKS: 'canUpdateLinks',
    // GuideMe
    MANAGE_GUIDES: 'canManageGuides',
    ACCESS_GUIDES: 'canAccessGuides',
    CREATE_GUIDES: 'canCreateGuides',
    DELETE_GUIDES: 'canDeleteGuides',
    UPDATE_GUIDES: 'canUpdateGuides',
}

export const roles = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    GUEST: 'GUEST'
}

export const rolePermissions = {
    [roles.ADMIN]: Object.values(permissions),
    [roles.USER]: [
        permissions.DELETE_OWN_ACCOUNT,
        permissions.UPDATE_OWN_ACCOUNT,
        permissions.CREATE_VIRTUAL_DEVICES,
        permissions.DELETE_OWN_DEVICES,
        permissions.UPDATE_OWN_DEVICES,
        permissions.CREATE_IMAGES
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