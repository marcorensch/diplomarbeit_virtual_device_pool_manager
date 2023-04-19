// permissionHandler.js

export const permissions = {
    // User Management
    CREATE_USERS: 'canCreateUsers',
    DELETE_USERS: 'canDeleteUsers',
    UPDATE_USERS: 'canUpdateUsers',
    DELETE_OWN_ACCOUNT: 'canDeleteOwnAccount',
    UPDATE_OWN_ACCOUNT: 'canUpdateOwnAccount',
    // Device Management
    CREATE_DEVICES: 'canCreateDevices',
    DELETE_DEVICES: 'canDeleteDevices',
    UPDATE_DEVICES: 'canUpdateDevices',
    CREATE_VIRTUAL_DEVICES: 'canCreateVirtualDevices',
    DELETE_VIRTUAL_DEVICES: 'canDeleteVirtualDevices',
    UPDATE_VIRTUAL_DEVICES: 'canUpdateVirtualDevices',
    UPDATE_OWN_DEVICES: 'canUpdateOwnDevices',
    DELETE_OWN_DEVICES: 'canDeleteOwnDevices',
    // CabinetBuilder Management
    CREATE_LOCATION: 'canCreateLocation',
    DELETE_LOCATION: 'canDeleteLocation',
    UPDATE_LOCATION: 'canUpdateLocation',
    CREATE_CABINET: 'canCreateCabinet',
    DELETE_CABINET: 'canDeleteCabinet',
    UPDATE_CABINET: 'canUpdateCabinet',
    CREATE_SLOT: 'canCreateSlot',
    DELETE_SLOT: 'canDeleteSlot',
    UPDATE_SLOT: 'canUpdateSlot',
    // Document Management
    CREATE_DOCUMENTS: 'canCreateDocuments',
    DELETE_DOCUMENTS: 'canDeleteDocuments',
    UPDATE_DOCUMENTS: 'canUpdateDocuments',
    DELETE_OWN_DOCUMENTS: 'canDeleteOwnDocuments',
    UPDATE_OWN_DOCUMENTS: 'canUpdateOwnDocuments',
    // Image Management
    CREATE_IMAGES: 'canCreateImages',
    DELETE_IMAGES: 'canDeleteImages',
    UPDATE_IMAGES: 'canUpdateImages',
    // Link Management
    CREATE_LINKS: 'canCreateLinks',
    DELETE_LINKS: 'canDeleteLinks',
    UPDATE_LINKS: 'canUpdateLinks',
    // GuideMe Management
    CREATE_GUIDES: 'canCreateGuides',
    DELETE_GUIDES: 'canDeleteGuides',
    UPDATE_GUIDES: 'canUpdateGuides',
}

export const roles = {
    ADMIN: 'admin',
    USER: 'user',
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
    ]
}

export class PermissionHandler {
    constructor() {
        this.permissions = permissions
        this.roles = roles
        this.rolePermissions = rolePermissions
    }

    getPermissions(userRoles) {
        let allPermissions = []

        userRoles.forEach(role => {
            const rolePermissionsList = this.rolePermissions[role]
            if (rolePermissionsList) {
                allPermissions = allPermissions.concat(rolePermissionsList)
            }
        })

        return allPermissions
    }
}
