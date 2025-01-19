import { GREEN, RED, RESET_COLORS, YELLOW } from "./colors";

export type PossibleValues = unknown;
export type TestFunction = () => PossibleValues | Promise<PossibleValues>;
export type TestStatus = "not_executed" | "passed" | "failed";

export class MyTestClass {
  private testName: string;
  private testFunction: TestFunction;
  private status: TestStatus = "not_executed";
  private recivedError: string = "";

  public constructor(inTestName: string, inTestFunction: TestFunction) {
    this.testName = inTestName;
    this.testFunction = inTestFunction;
  }

  public toString(): string {
    return this.testName;
  }

  public async verifyTest(): Promise<boolean> {
    try {
      await this.testFunction();
      this.status = "passed";
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this.recivedError = error.message;
      }
      this.status = "failed";
      return false;
    }
  }

  public resultString(): string {
    let outString: string;
    if (this.status == "passed") {
      outString = `${GREEN}PASSED: ${this.testName} `;
    } else if (this.status == "failed") {
      outString = `${RED}FAILED: ${this.testName} \t${this.recivedError}`;
    } else {
      outString = `${YELLOW}NOT EVALUATED: ${this.testName}`;
    }
    return outString + RESET_COLORS;
  }
}

//-------------------------------------------------------------------------------------------------------

export function createTest(
  inTestName: string,
  inTestFunction: TestFunction
): MyTestClass {
  return new MyTestClass(inTestName, inTestFunction);
}

function areObjectsEquals(obj1: any, obj2: any): boolean {
  //console.log(obj1, obj2);
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }
  const keyArray1: string[] = Object.keys(obj1);
  const keyArray2: string[] = Object.keys(obj2);

  if (keyArray1.length != keyArray2.length) return false;

  for (let key1 of keyArray1) {
    if (!keyArray2.includes(key1)) return false;

    const val1 = (obj1 as any)[key1];
    const val2 = (obj2 as any)[key1];

    //console.log(val1 + "  " + val2);
    if (!areObjectsEquals(val1, val2)) {
      return false;
    }
  }

  return true;
}
export function evaluateEquality(obj1: any, obj2: any, errMsg?: string) {
  if (!areObjectsEquals(obj1, obj2)) {
    const errorMsg: string =
      "The objects are not equal." +
      `\n\t${JSON.stringify(obj1)}\n\t${JSON.stringify(obj2)}`;
    throw new Error(errMsg || errorMsg);
  }
}
