export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  createidAt: Date;
  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createidAt = new Date();
  }
}
