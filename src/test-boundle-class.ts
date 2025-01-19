import { BLUE, RESET_COLORS } from "./colors";
import { MyTestClass,  TestFunction } from "./test-class";

export type BeforeBoundle = (() => void | Promise<void>) | null; // Ogni tester ne può avere uno personalizzato
export type AftherBoundle = (() => void | Promise<void>) | null; // Ogni tester ne può avere uno personalizzato
export type BeforeEachTest = (() => void | Promise<void>) | null;
export type AftherEachTest = (() => void | Promise<void>) | null;

export class BoundleTester {
  private boundleName: string;
  private numberOfTest: number = 0; // si aggiorna solo dopo l' esecuzione!
  private numberOfPassedTests: number = 0;
  private isAlreadyTestedBool: boolean = false; // ci dice se posssiamo eseguire i test con il metodo .execute()
  private testArray: MyTestClass[] = [];

  private doBeforeThisBoundle: BeforeBoundle = null;
  private doAftherThisBoundle: AftherBoundle = null;
  private doBeforeTest: BeforeEachTest = null;
  private doAftherTest: AftherEachTest = null;

  public constructor(name: string) {
    this.boundleName = name;
  }

  public isAlreadyTested() {
    // controlla se posssiamo eseguire il boundle oppure no
    return this.isAlreadyTestedBool;
  }

  public getName() {
    return this.boundleName;
  }

  public beforeThisBoundle(bfAll: BeforeBoundle) {
    this.doBeforeThisBoundle = bfAll;
    return this;
  }

  public aftherThisBoundle(afAll: AftherBoundle) {
    this.doAftherThisBoundle = afAll;
    return this;
  }

  public beforeEachTest(bf: BeforeEachTest) {
    this.doBeforeTest = bf;
    return this;
  }

  public aftherEachTest(ae: AftherEachTest) {
    this.doAftherTest = ae;
    return this;
  }

  public setTestArray(tsArr: MyTestClass[]) {
    this.testArray = tsArr;
    return this;
  }

  public addTestArray(tsArr: MyTestClass[]) {
    this.testArray = [...this.testArray, ...tsArr];
    return this;
  }

  public addTest(testName: string, testFunction: TestFunction) {
    const myTest = new MyTestClass(testName, testFunction);

    this.testArray.push(myTest);
    return this;
  }

  public getExecuteReference() {
    return this.execute;
  }

  public async execute() {
    this.checkExecuteAndPrint();

    try {
      if (this.doBeforeThisBoundle != null) {
        await this.doBeforeThisBoundle();
      }

      this.numberOfTest = this.testArray.length;
      let currentTestNumber = 1;

      for (let test of this.testArray) {
        if (this.doBeforeTest != null) {
          await this.doBeforeTest();
        }

        const testOutcome = await test.verifyTest();
        if (testOutcome) this.numberOfPassedTests++;
        console.log(
          `• ${currentTestNumber}/${this.numberOfTest} ${test.resultString()}`
        );

        if (this.doAftherTest != null) {
          await this.doAftherTest();
        }

        currentTestNumber++;
      }

      if (this.doAftherThisBoundle != null) {
        await this.doAftherThisBoundle();
      }
      this.printStatAftherExecute();
    } catch (error) {}
  }


  private checkExecuteAndPrint() {
    if (this.isAlreadyTestedBool) {
      console.log;
      return;
    }
    this.isAlreadyTestedBool = true;

    if (this.setTestArray == null) {
      throw new Error(
        "no Test defined in the Tester Class: make sure to add atleast a test"
      );
    }

    console.log(
      BLUE +
        "\n \tExecuting test boundle: " +
        this.boundleName +
        "\n" +
        RESET_COLORS
    );
  }
  private printStatAftherExecute() {
    console.log(
      BLUE +
        `\n \tResult: ${this.numberOfPassedTests}/${
          this.numberOfTest
        } the success rate of the test boundle is: ${calcPerc(
          this.numberOfPassedTests,
          this.numberOfTest
        )}\n` +
        RESET_COLORS
    );
  }
}

function calcPerc(partial: number, total: number) {
  if (total === 0) {
    return "0.00%"; // Evita divisione per zero
  }

  const percentuale = (partial / total) * 100;
  return `${percentuale.toFixed(2)}%`;
}

export function createNewBoundle(name: string) {
  return new BoundleTester(name);
}
