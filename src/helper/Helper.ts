export class Helper {
  public static getSorted<T>(result: PromiseSettledResult<T[]>): T[] {
    return result.status === "fulfilled" ? result.value.sort() : [];
  }
}
