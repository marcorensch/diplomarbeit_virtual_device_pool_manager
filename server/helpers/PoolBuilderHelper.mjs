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

    static async storeItem(builderItem) {
        const database = new DatabaseModel();
        const query = "INSERT INTO builder_items (name, category_id, description, hidden, sorting, parent_id, params) VALUES (?,?,?,?,?,?,?)";
        const data = [builderItem.name, builderItem.category_id, builderItem.description, builderItem.hidden, builderItem.sorting, builderItem.parent_id, builderItem.params];
        const poolBuilderItems = await database.query(query, data);
        return poolBuilderItems;
    }

    static async getCategories() {
        const database = new DatabaseModel();
        const poolBuilderCategories = await database.query("SELECT * FROM builder_categories");
        return poolBuilderCategories;
    }
}