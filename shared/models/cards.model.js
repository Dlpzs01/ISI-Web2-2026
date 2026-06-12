export default class Card {
  constructor(id, title, description, teamId, etag) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.teamId = teamId;
    this.etag = etag;
  }
  // Método para mapear el JSON
  static fromJson(json) {
    return new Card(
      json.id,
      json.title,
      json.description,
      json.teamId,
      json.etag,
    );
  }
}
