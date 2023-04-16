import { actions, roles } from "./constants.mjs";

const mappings = new Map();

mappings.set(actions.CREATE_ACCOUNT, [roles.ADMIN]);
mappings.set(actions.DELETE_ACCOUNT, [roles.ADMIN]);
mappings.set(actions.UPDATE_ACCOUNT, [roles.ADMIN]);
mappings.set(actions.DELETE_OWN_ACCOUNT, [roles.USER]);
mappings.set(actions.UPDATE_OWN_ACCOUNT, [roles.ADMIN, roles.USER]);

export default mappings;