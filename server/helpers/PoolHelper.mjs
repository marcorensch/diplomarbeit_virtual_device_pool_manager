import DatabaseModel from "../models/DatabaseModel.mjs";

export default class PoolHelper {
    static async getItems(categoryId, parentId = null) {

        const databaseModel = new DatabaseModel();
        const query = `SELECT bi.*
                       FROM builder_items AS bi
                       WHERE bi.category_id = ?
                         AND bi.parent_id ${parentId ? "= ?" : "IS NULL"}`;
        const values = [categoryId];
        if (parentId) values.push(parentId);
        return await databaseModel.query(query, values);

    }

    static async getCategoryByAlias(categoryAlias) {
        const databaseModel = new DatabaseModel();
        const categories = await databaseModel.query("SELECT * FROM builder_categories WHERE alias = ? LIMIT 1", [categoryAlias]);
        if (categories.length === 0) return false;
        return categories[0];
    }

    static async getItem(id, deep = false) {
        const databaseModel = new DatabaseModel();
        const item = await databaseModel.query("SELECT * FROM builder_items WHERE id = ? LIMIT 1", [id]);
        item[0].label = await PoolHelper.getSlotLabel(id);
        if (item.length === 0) throw {type: "ITEM_NOT_FOUND"};
        if (deep) {
            item[0].children = await PoolHelper.getItemsByParentId(item[0].id, deep);
        }
        return item[0];
    }

    static async getItemsByParentId(parentId, deep) {
        const databaseModel = new DatabaseModel();
        const query = `SELECT i.*, GROUP_CONCAT(d.id) AS device_ids, GROUP_CONCAT(d.name) AS device_names, GROUP_CONCAT(d.added)  AS device_added
                       FROM builder_items AS i
                                LEFT JOIN devices as d ON i.id = d.slot_id
                       WHERE parent_id = ?
                       GROUP BY i.id`;
        const items = await databaseModel.query(query, [parentId]);
        if (deep) {
            for (const item of items) {
                item.children = await PoolHelper.getItemsByParentId(item.id, deep);
            }
        }
        return items;
    }

    static async getSlotLabel(id) {
        const databaseModel = new DatabaseModel();
        const item = await databaseModel.query("SELECT parent_id, name FROM builder_items WHERE id = ? LIMIT 1", [id]);
        if (item.length === 0) throw {type: "ITEM_NOT_FOUND"};
        const labelConstruct = [item[0].name];
        let parentId = item[0].parent_id;
        while (parentId) {
            const parent = await databaseModel.query("SELECT parent_id, name FROM builder_items WHERE id = ? LIMIT 1", [parentId]);
            if (parent.length === 0) throw {type: "ITEM_NOT_FOUND"};
            labelConstruct.unshift(parent[0].name);
            parentId = parent[0].parent_id;
        }
        let label = "";
        for (let i = 0; i < labelConstruct.length; i++) {

            if (i === labelConstruct.length - 1) {
                if (Number.isInteger(parseInt(labelConstruct[i]))) {
                    if (parseInt(labelConstruct[i]) < 10) label += "0" + labelConstruct[i];
                } else {
                    label += labelConstruct[i];
                }
            } else {
                label += labelConstruct[i];
            }

            if (i === 0) label += ", ";
            if (i === 1) label += ".";

        }
        return label;
    }

}