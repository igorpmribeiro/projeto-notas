const knex = require("../database/knex");

class NotesController {

  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params
    const [note_id] = await knex("notes").insert({ title, description, user_id });

    // await knex("notes").insert({ title, description, tags, links });


    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }    
    });

    await knex("links").insert(linksInsert);
    
    
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }    
    });

    await knex("tags").insert(tagsInsert);

    return response.status(201).send();
  }

  async show (request, response) {
    const { user_id } = request.params;
    const notes = await knex("notes").where({ user_id });

    return response.json(notes);
  }

  async delete (request, response) {
    const { id } = request.params;
    const { user_id } = request.body;
    const note = await knex("notes").where({ id }).first();

    if (!note) {
      return response.status(400).json({ message: "Note not found" });
    }

    if (note.user_id !== user_id) {
      return response.status(401).json({ message: "Operation not permitted." });
    }

    await knex("notes").where({ id }).delete();

    return response.status(204).send();
  }

  async index (request, response) {
    const { title, user_id, tags } = request.query;

    let notes;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());

      notes = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.description" ])
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "tags.note_id", "notes.id")
      .orderBy("notes.title");
    } else {

      notes = await knex("notes")
        .whereLike("title", `%${title}%`)
        .where({ user_id })
        .orderBy("title");
    }

    return response.json(notes);
  }
}

module.exports = NotesController;