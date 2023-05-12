import DatabaseModel from "../models/DatabaseModel.mjs";

export default class PoolBuilderHelper {

    static async getItems(categoryId, parentId) {
        if(!categoryId) throw new Error("No category specified");

        const database = new DatabaseModel();
        let query = "SELECT * FROM builder_items WHERE category_id = ?";
        let data = [categoryId];
        if(parentId) {
            query += " AND parent_id = ?";
            data.push(parentId);
        }
        query += " ORDER BY sorting ASC";
        const poolBuilderItems = await database.query(query, data);
        return poolBuilderItems;
    }

    static async getItem(id) {
        if(!id) throw new Error("No id specified");
        const database = new DatabaseModel();
        const query = "SELECT * FROM builder_items WHERE id = ? LIMIT 1";
        const poolBuilderItem = await database.query(query, [id]);
        if(poolBuilderItem.length === 0) throw new Error("No item found");
        return poolBuilderItem[0];
    }

    static async storeItem(builderItem) {
        const database = new DatabaseModel();
        const query = "INSERT INTO builder_items (name, category_id, description, hidden, sorting, parent_id, params) VALUES (?,?,?,?,?,?,?)";
        const data = [builderItem.name, builderItem.category_id, builderItem.description, builderItem.hidden, builderItem.sorting, builderItem.parent_id, builderItem.params];
        const poolBuilderItems = await database.query(query, data);
        return poolBuilderItems;
    }

    static async updateItem(id, builderItem) {
        if(!id) throw new Error("No id specified");
        const database = new DatabaseModel();
        const query = "UPDATE builder_items SET name = ?, category_id = ?, description = ?, hidden = ?, sorting = ?, parent_id = ?, params = ? WHERE id = ?";
        const data = [builderItem.name, builderItem.category_id, builderItem.description, builderItem.hidden, builderItem.sorting, builderItem.parent_id, builderItem.params, id];
        const poolBuilderItems = await database.query(query, data);
        return poolBuilderItems;
    }

    static async getCategories() {
        const database = new DatabaseModel();
        const poolBuilderCategories = await database.query("SELECT * FROM builder_categories");
        return poolBuilderCategories;
    }

    static async sortItems(sortMap) {
        const database = new DatabaseModel();
        const promises = [];
        for(const [index, data] of Object.entries(sortMap)) {
            promises.push(database.query("UPDATE builder_items SET sorting = ? WHERE id = ?", [data.sorting, data.id]));
        }
        await Promise.all(promises);
    }

    static async deleteItem(id) {
        if(!id) throw new Error("No id specified");
        const database = new DatabaseModel();
        return await database.query("DELETE FROM builder_items WHERE id = ?", [id])
    }
}