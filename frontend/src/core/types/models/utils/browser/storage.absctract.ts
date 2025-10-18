export abstract class StorageAbstract {
  static get KEY(): string {
    throw new Error("KEY must be defined in subclass");
  }

  static get() {
    return localStorage.getItem(this.KEY) || "";
  }

  static set(value: string) {
    localStorage.setItem(this.KEY, value);
  }

  static exists() {
    return !!this.get();
  }

  static remove() {
    localStorage.removeItem(this.KEY);
  }
}