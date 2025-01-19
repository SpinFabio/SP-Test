import { BoundleTester } from "./test-boundle-class";
import { RESET_COLORS, YELLOW } from "./colors";

// manager will be a SINGLETON
let myTestManager: TestManager | null = null;

export type BeforeAllBoundles = (() => void | Promise<void>) | null; // Ogni tester ne può avere uno personalizzato
export type AftherAllBoundles = (() => void | Promise<void>) | null; // Ogni tester ne può avere uno personalizzato

export class TestManager {
  private boundleArray: BoundleTester[] = [];
  public doBeforeAllBoundle: BeforeAllBoundles = null;
  public doAftherAllBoundle: AftherAllBoundles = null;

  public addTester(tester: BoundleTester) {
    this.boundleArray.push(tester);
  }

  public async executeAll() {
    if (this.doBeforeAllBoundle != null) {
      await this.doBeforeAllBoundle();
    }

    try {
      const boundlePromise = this.checkAndPromise();
      await Promise.all(boundlePromise);
    } catch (error) {
      //console.error("Errore durante l'esecuzione dei bundle:", error);
      throw new Error("an error occurred during boundle execution");
    } finally {
      if (this.doAftherAllBoundle != null) {
        await this.doAftherAllBoundle();
      }
    }
  }

  private checkAndPromise(): Promise<void>[] {
    if (this.boundleArray.length == 0) {
      throw new Error("No tests have been defined.");
    }

    const uniqueBoundleMap: Map<string, BoundleTester> = new Map();

    for (let boundle of this.boundleArray) {
      if (uniqueBoundleMap.get(boundle.getName()) == undefined) {
        uniqueBoundleMap.set(boundle.getName(), boundle);
      } else {
        console.log(
          YELLOW +
            `\nThe bundle named "${boundle.getName()}" has been inserted multiple times\n` +
            RESET_COLORS
        );
      }
    }
    this.boundleArray = Array.from(uniqueBoundleMap.values());

    const boundlePromise = this.boundleArray.map((boundle) => {
      return boundle.execute(); // ritorniamo solo la funziona async -> e quindi la promise che vogliamo eseguire e non l' intero oggetto
    });
    return boundlePromise;
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------
function checkManager(): TestManager {
  CreateTestManager();
  if (myTestManager == null) {
    throw new Error("Test manager is not defined");
  }
  return myTestManager;
}
function CreateTestManager() {
  if (myTestManager == null) {
    myTestManager = new TestManager();
  }
  return myTestManager;
}

//------------------------------------- MANAGER API ----------------------------------------------------------------

export function addTestBundle( // aggiungiamo un boundle di test al test managermanager
  testBundleName: string | BoundleTester
): BoundleTester {
  if (typeof testBundleName === "string") {
    const tester: BoundleTester = new BoundleTester(testBundleName);
    checkManager().addTester(tester);
    return tester;
  } else {
    checkManager().addTester(testBundleName);
    return testBundleName;
  }
}

export function runAllTest() {
  checkManager().executeAll();
}

export function beforeAllBoundles(bb: BeforeAllBoundles) {
  checkManager().doBeforeAllBoundle = bb;
}

export function aftherAllBoundles(ae: AftherAllBoundles) {
  checkManager().doAftherAllBoundle = ae;
}
