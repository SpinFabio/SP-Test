> DISCLAIMER: this pkg has no predenency of consistency between version, maybe some API names will be changed and some will be remove completely (like before beforeEachTest(()=>{})...  )
feel free to use the library, evrithing shold be working correctly
the library has no pretendencies of high efficency,  the main goal is the semplicity of set up and the install and use, so i think that it will be inpractical or just not performant on large project with a ton of tests

>GOALS : tand alone TS library or just minmal set of dependencies, simple and mimal to non config needed 


# API documentation of SP-Test


we can setup the Test manager using this functions:



```TS
beforeAllBoundle(()=>{mysql.connect(connectionCOnfig)})
.addTestBundle(myTestBoundle1)
.addTestBundle(myTestBoundle2)
.addTestBundle(myTestBoundle3)
.addTestBundle(myTestBoundle4)
.addTestBundle(myTestBoundle5)
.addTestBundle(myTestBoundle6)
aftherAllBoundles(()=>{mysql.endConnection()})
```
in each test boundle, usually defined in indipendent file, we eill write something like:

```TS

export const userBoundleTest = createNewBoundle("boundle di user")
  .setBeforeThisBoundle(() =>
    console.log("vengo eseguito prima del primo boundle utenste")
  )
  .setBeforeEachTest(() => console.log("vengo eseguito prima di ogni test"))
  .addTest("sono il test 1 di user", () => "ciao", "ciaone")
  .addTest("sono il test 2 di user", () => 1, 1)
  .addTest("sono il test 1 di user", () => "ciao", "ciaone")
  .addTest("sono il test 1 di user", () => "ciao", "ciaone")
  .addTest("sono il test 2 di user", () => 1, 1)
  .addTest("sono il test 2 di user", () => 1, 1)
  .addTest("sono il test 1 di user", () => "ciao", "ciaone")
  .addTest("sono il test 2 di user", () => 1, 1)
  .setAftherEachTest(() => console.log("vengo eseguito DOPO ogni test"))
  .setAftherThisBoundle(() =>
    console.log("vengo eseguito DOPO tutto il primo boundle utete")
  );
```




when everything is set up properly we can execute all the test using the function 
```TS
testAll()
```
this function execute each TestBoundle indipendently from each others: they will not be sincronized in any way between bounle, the operations will be executed 
sequentially only in each boundle. so each boundle will be concurrent with each others.
having said that , you should be aware that the boundle operation should be INDIPENDET between each other (teh same shold be true about test)




# main APIS


Functions

addTestBundle()
runAllTest()
beforeAllBoundles(bb: BeforeAllBoundles)
aftherAllBoundles(ae: AftherAllBoundles)

createTest(
  inTestName: string,
  inTestFunction: TestFunction
)

evaluateEquality(obj1: any, obj2: any, errMsg?: string)
createNewBoundle(name: string)

# Most relevant methods 
const myTestBoundle = createBoundle("meaningful obundle name")
.beforeThisBoundle(()=>{
  console.log("here i can define a void promise ")
})
.aftherThisBoundle(()=>{
  console.log("here i can define a void promise ")
})
.addTest("testname",()=>{
  // here insert some code that will throw error
  // like some of the evaluathe methods
})



# what will come next:

* im goning to implement more evaluateSomething() functions 
* maybe some methods will be renemed to get a more plesant wtiting experience, 
i like the jest naming conventions, maybe i will rename some 
* some kind of partial execution of all the boundle inserted in the manager
* some kind of Logging System



