import DatabaseModel from "../models/DatabaseModel.mjs";

export default class GuidesHelper {
    static async getGuides(limit, page, search, visibility) {
        const offset = (page - 1) * limit;
        let values = [];
        let countValues = [];

        const database = new DatabaseModel();
        let query = "SELECT * FROM guides";
        let countQuery = "SELECT COUNT(*) AS count FROM guides";

        if (search !== null) {
            const string = " WHERE name LIKE ?";
            query += string;
            countQuery += string;
            values.push(`%${search}%`);
            countValues.push(`%${search}%`);
        }

        if (visibility !== null) {
            const string = search === null ? " WHERE visible = ?" : " AND visible = ?";
            query += string;
            countQuery += string;
            values.push(visibility);
            countValues.push(visibility);
        }
        query += " ORDER BY id DESC LIMIT ? OFFSET ?";
        values.push(limit, offset);

        const guides = await database.query(query, values);
        let count = await database.query(countQuery, countValues);

        return {guides, count: count[0].count};
    }

    static async getGuide(id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guides WHERE id = ? LIMIT 1";
        const guide = await database.query(query, [id]);
        if (guide.length === 0) return null;
        return guide[0];
    }

    static async getLinkedDeviceIds(id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guides_devices WHERE guide_id = ?";
        return await database.query(query, [id]);
    }

    static async createGuide(guide) {
        const database = new DatabaseModel();
        const query = "INSERT INTO guides (name, description, visible) VALUES (?, ?, ?)";
        const result = await database.query(query, [guide.name, guide.description, guide.visible]);
        return result.affectedRows === 1 ? result.insertId : null;
    }

    static async updateGuide(id, guide) {
        const database = new DatabaseModel();
        const query = "UPDATE guides SET name = ?, description = ?, visible = ? WHERE id = ?";
        const result = await database.query(query, [guide.name, guide.description, guide.visible, id]);
    }

    static async deleteGuide(id) {
        const database = new DatabaseModel();
        const query = "DELETE FROM guides WHERE id = ?";
        const result = await database.query(query, [id]);
        return result.affectedRows === 1;
    }

    static async getSlides(guide_id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guide_slides WHERE guide_id = ? ORDER BY sorting ASC";
        return await database.query(query, [guide_id]);
    }

    static async getSlide(id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guide_slides WHERE id = ? LIMIT 1";
        const slide = await database.query(query, [id]);
        if (slide.length === 0) return null;
        return slide[0];
    }

    static async createSlide(slide) {
        const database = new DatabaseModel();
        const query = "INSERT INTO guide_slides (guide_id, name, content, notes, uri, sorting) VALUES (?, ?, ?, ?, ?, ?)";
        const result = await database.query(query, [slide.guide_id, slide.name, slide.content, slide.notes, slide.uri, slide.sorting]);
        return result.affectedRows === 1 ? result.insertId : null;
    }

    static async updateSlide(slide, action) {
        const database = new DatabaseModel();
        let query = '';
        let values = [];
        if(action === "sorting") {
            query = "UPDATE guide_slides SET sorting = ? WHERE id = ?";
            values = [slide.sorting, slide.id];
        }else{
            query = "UPDATE guide_slides SET name = ?, content = ?, notes = ?, uri = ?, sorting = ? WHERE id = ?";
            values = [slide.name, slide.content, slide.notes, slide.uri, slide.sorting, slide.id];
        }

        const result = await database.query(query, values);
        return result.affectedRows === 1;
    }

    static async deleteSlide(id) {
        const database = new DatabaseModel();
        const query = "DELETE FROM guide_slides WHERE id = ?";
        const result = await database.query(query, [id]);
        return result.affectedRows === 1;
    }
}