// src/utils/mutex.ts
export class Mutex {
  private locked = false;
  private waiting: (() => void)[] = [];

  async lock(): Promise<() => void> {
    return new Promise(resolve => {
      if (!this.locked) {
        this.locked = true;
        resolve(this.unlock.bind(this));
      } else {
        this.waiting.push(() => resolve(this.unlock.bind(this)));
      }
    });
  }

  private unlock() {
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      next && next();
    } else {
      this.locked = false;
    }
  }
}
