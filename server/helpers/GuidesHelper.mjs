import DatabaseModel from "../models/DatabaseModel.mjs";

export default class GuidesHelper {
    static async getGuides() {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guides";
        const guides = await database.query(query);
        console.log(guides)
        return guides
    }

    static async getGuide(id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guides WHERE id = ? LIMIT 1";
        const guide = await database.query(query, [id]);
        if (guide.length === 0) return null;
        return guide[0];
    }

    static async createGuide(guide) {
        const database = new DatabaseModel();
        const query = "INSERT INTO guides (name, description) VALUES (?, ?)";
        const result = await database.query(query, [guide.name, guide.description]);
        return result.affectedRows === 1 ? result.insertId : null;
    }

    static async updateGuide(id, guide) {
        return await Guides.findByIdAndUpdate(id, guide);
    }

    static async deleteGuide(id) {
        return await Guides.findByIdAndDelete(id);
    }

    static async getSlides(guide_id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM guide_slides WHERE guide_id = ?";
        return await database.query(query, [guide_id]);
    }

    static async createSlide(slide) {
        const database = new DatabaseModel();
        const query = "INSERT INTO guide_slides (guide_id, name, content, notes, uri, sorting) VALUES (?, ?, ?, ?, ?, ?)";
        const result = await database.query(query, [slide.guide_id, slide.name, slide.content, slide.notes, slide.uri, slide.sorting]);
        return result.affectedRows === 1 ? result.insertId : null;
    }

    static async updateSlide(slide) {
        const database = new DatabaseModel();
        const query = "UPDATE guide_slides SET name = ?, content = ?, notes = ?, uri = ?, sorting = ? WHERE id = ?";
        const result = await database.query(query, [slide.name, slide.content, slide.notes, slide.uri, slide.sorting, slide.id]);
        return result.affectedRows === 1;
    }
}