export default class User {
  constructor({ id = null, email, password, createdAt = new Date() } = {}) {
    if (!email) {
      throw new Error("User.email is required");
    }
    if (!password) {
      throw new Error("User.password is required");
    }

    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  static fromPrisma(record) {
    if (!record) return null;
    const { id, email, password, createdAt } = record;
    return new User({ id, email, password, createdAt });
  }

  toPrismaInput() {
    return {
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
    };
  }
}
