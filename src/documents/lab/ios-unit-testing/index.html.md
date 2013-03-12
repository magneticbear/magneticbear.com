---
layout: 'post-lab'
title: 'iOS Unit Testing'
author: 'stu'
nav: 'lab'
date: 2013-03-13 9:12
short_url: 'mgn.tc/iosut'
---
There are numerous types of unit testing frameworks for Objective-C. From the basic OCTest/Sentest, to BDD-style frameworks like [Kiwi](https://github.com/allending/Kiwi) and [Cedar](https://github.com/pivotal/cedar). We'll be testing three of them here. OCtest, [GHUnit](https://github.com/gabriel/gh-unit), and Kiwi. These were chosen due to popularity and support. Other options such as Cedar may be viable, but aren't as well supported.

---

## Testing criteria
1. Ease of use
    - writing a useful test method
    - ease of interpretation
    - ease of automated testing
2. Support for Asynchronous testing
3. Integration with Xcode

These are rated in order of importance to me. Ease of use and async testing support are crucial. Integration with Xcode, while important, isn't as vital.

## Testing
Each framework will run through each of the following:
* Test a basic test scenario (the temperature conversion)
* Test a basic network connection (Using AFnetworking)
* Testing compatibility with Jenkins

## Test a basic test scenario
The first test case I ever wrote was for a temperature conversion method. It's simple, yet has enough to worry about that fringe cases will be required.

In our Test Project's viewController, we'll have two methods.

``` objectivec
- (double)convertCelsiusToFarenheit:(double)celsius {
    double farenheit = 0;
    farenheit = celsius * (9/5) + 32;
    return farenheit;
}
```

``` objectivec
- (double)convertFarenheithToCelsius:(double)farenheit {
    double celsius = 0;
    celsius = (5/9) * (farenheit - 32);
    return celsius;
}
```

Yes, these methods are a little contrived and verbose, but they'll serve for what we need.

Looking at these, we know we'll have a few test cases to worry about:

* -40 is the same for both temperatures. We must test for this.
* 32 degrees Farenheit must equal 0 Celsius
* 100 degrees Celsius must equal 212 Farenheit.
* converting one temperature and back to the original should produce the correct number.

If any of these test cases fail, we know there's a problem with our methods.

## OCunit
OCUnit is the easiest of the frameworks to set up. When setting up the project, simply check `include unit tests` in the setup box. This creates a second target that's specific to the OCTest Framework.

### Writing Tests
First, set up your setup and TearDown Methods to create destroy a viewController Object

``` objectivec
- (void)setUp
{
    [super setUp];
    controller = [[ViewController alloc] init];
    // Set-up code here.
}
```

``` objectivec
- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
    controller = nil;
}
```

On to the tests. All test methods must begin with "test". This is how OCUnit determines what's a test, and what isn't.

First, we'll check if -40 equals -40:
``` objectivec
- (void)testCelsiusEqualsFarenheitAtNegativeForty {
    double celsiusResult = 0;
    double farenheitResult = 0;
    
    celsiusResult = [controller convertFarenheithToCelsius:-40];
    farenheitResult = [controller convertCelsiusToFarenheit:-40];
    STAssertEquals(celsiusResult, farenheitResult, @"these should be the same");
}
```

Next, we check that 32 Farenheit if 0 Celsius, and vice versa
``` objectivec
-(void)testThatThirtyTwoFarenheitEqualsZeroCelsius{
    double celsiusResult = [controller convertFarenheithToCelsius:32];
    double farenheitResult = [controller convertCelsiusToFarenheit:0];
    STAssertEquals(celsiusResult, 0, @"should be zero");
    STAssertEquals(farenheitResult, 32, @"should equal 32");
}
```

We test that 100 Celsius is 212 Farenheit and vice versa
``` objectivec
- (void)testThatHundredCelsiusIsTwoTwelveFarenheit {
    double farenheitResult = [controller convertCelsiusToFarenheit:100];
    double celsiusResult = [controller convertFarenheithToCelsius:212];
    STAssertEquals(farenheitResult, 212, @"should equal 212");
    STAssertEquals(celsiusResult, 100, @"should equal 100");
}
```

Finally, test that the temperatures can be converted back and forth
``` objectivec
- (void)testThatConvertingBackAndForthDoesntAffectResults {
    double celsius = 50;
    double farenheitResult = [controller convertCelsiusToFarenheit:celsius];
    //convert back
    double celsiusResult = [controller convertFarenheithToCelsius:farenheitResult];
    STAssertEquals(celsius, celsiusResult, @"should be equal");   
}
```

We could split these up even further (one STassert per test), but this will do for our purposes.

Running the test suite is also really easy with Xcode. Simply change your target to, and run as test. If there isn't a scheme for the tests, it's easily added in the manage schemes window.
Overall, integrating these tests into Xcode, and writing basic tests are fairly simple and easy to do. No different than GHUnit Really.

### Ease of interpretation:
Unfortunately, this is where OCUnit begins to falter. If a test fails, it automatically pops up as an error inside Xcode where the assert call is. For those who are used to other frameworks like JUnit, this is an annoyance as we can't determine if there are other errors that are actually affecting the code, and overall looks much more cluttered. The Console output isn't much better, with the output hard to read.

### Automated Testing
As we'll see in most of our frameworks, automated testing is not an easy task I won't go into the full details here, as there are numerous postings about the problems with Xcode and Jenkins. The summary is that `xcodebuild` in Xcode 4 doesn't support unit testing on iOS (Amusingly, OSX Unit testing allowed and easy to implement). The solution is to run the tests through the simulator, then take the console output, and format it to an XML file that Jenkins can understand. This is completed most often with a script written in Ruby. It can be found [here](https://github.com/ciryon/OCUnit2JUnit).

Resources:

* [Running OCUnit (or Specta) Tests from Command Line](http://www.raingrove.com/2012/03/28/running-ocunit-and-specta-tests-from-command-line.html)
* [Xcode 4.5 command line unit testing](http://www.raingrove.com/2012/03/28/running-ocunit-and-specta-tests-from-command-line.html)

### Asynchronous Testing
Unit Tests by design are intended to run fast. Because of this, Apple made the decision to not wait for asynchronous requests during a test, and assume they had passed. As such, any code inside the request won't actually be tested! In the world of constant server connections, this is a huge problem. There are however, some workarounds:

* Implement a semaphore in your test case. This forces the test to wait until the semaphore is dispatched, allowing the block or async request to finish and be tested.
* Implement the OCMock Framework. OCMock is a testing suite in it's own right, but is most often used in tandem with a typical testing framework. OCMock has some methods in it's implementation that allow for a mocked object to "expect" a response. When this response is expected, it invokes the block response, and the code is tested then.

In my opinion, either of these are a rather ugly hack. I'd rather have a framework that takes a second longer to finish a request, than implement the solutions above.

## GHUnit
GHUnit is another popular style of Unit Testing. Apparently, before Xcode 4, adding OCunit was a pain. Compared to the power of GHUnit had, most people used GHUnit exclusively. While that has since changed, it's worth looking into GHUnit Regardless.

### Integration
Integration is slightly more complicated than OCUnit, but using [cocoapods](http://www.cocoapods.org) makes things much easier. I originally intended to write how to set up GHUnit, but a tutorial is already available [here](http://samwize.com/2012/10/04/how-to-setup-ghunit-with-cocoapods/), and it explains it much better than I could. Be sure to check it out.

### Writing Tests
First, create your test file inside the GH Target. Instructions can be found [here](http://gabriel.github.com/gh-unit/docs/appledoc_include/guide_testing.html) Just be sure that if you copy and paste the template, to change `GHAssertNotNull` to `GHAssertNotNil`. It appears the docs haven't been updated since the arc conversion.

The rest of the test writing is fairly straightforward. Pretty much the same as OCUnit. In fact, it still contains the same setup and tear down methods, as well as the same methods. The only difference is that instead of STAssert(), we use GHAssert. The syntax is the same. GHUnit though has more assert methods than OCUnit, making it easier to write tests.

### Ease of interpretation
GHUnit's main power is easy interpretation. If these tests are being run from Xcode instead of CI, the simulator pops up with easily readable results. The console output is also quite easy to read. It either passes or fails. Nothing fancy, Just what you need.

### Automated Testing
Automated testing is slightly different While you still have to run through the simulator, most people tell jenkins to run a build script that has a make file inside of it. This is the method used [here](http://www.youtube.com/watch?v=6ycxFcIPhQg). It's much better than I can explain, so I'll just leave it here.

Thankfully, GHUnit outputs results as a JUnit style XML file. This saves us the step of having to convert the console output to something readable like in the OCUnit step.

### Asynchronous testing
Like OCUnit, GHunit doesn't support Asynchronous testing out of the box. The reasons why and the solutions to implement them are the same.

## Kiwi Testing
Kiwi is a slightly different style of testing. While GHUnit and OCUnit are based around test cases that pass or fail. Kiwi follows the concept of stories or specifications that must be acted out. This is popular in BDD style testing.

### Integration With Xcode
Kiwi, while not as easy as OCunit, is still a fair sight easier than GHUnit. A simple cocoapods install and a new TestUnit Target, and you're ready to write your tests.

### Writing Tests
Kiwi is different syntactically speaking in comparison to OCUnit and GHUnit. Instead of setting up test methods, you set up specifications that you expect to be passed.

``` objectivec
SPEC_BEGIN(TemperatureConverterTests)

describe(@"basic converter", ^{
  it(@"converts farenheit To celsius", ^{
    ViewController *controller = [ViewController alloc]init];
    [[theValue([controller convertCelisusToFarenheit:-40]) should]equal:theValue(-40)];
  });
  it(@"converts celsius to farenheight", ^{
    ViewController *controller = [ViewController alloc]init];
    [[theValue([controller convertfarenheitToCelsius:-40]) should]equal:theValue(-40)];
  });
});

SPEC_END
```

This syntax is a fair bit different. That's because with Kiwi, we're more describing stories and specifications than actual tests.

### Ease of interpretation
The logs in Kiwi are a lot easier to read than OCUnit. With it's human like syntax when writing the specs, these descriptions are taken and output at the console. If a human needs to read these logs, they'll be able to do it as easily as GHUnit's output.

### Automated Testing
Automated Testing in Kiwi requires a bit of work. Due to Xcode not allowing application unit tests (the same problem as OCUnit), we have to hack our way through. Some people have had success with [ios-sim](https://github.com/phonegap/ios-sim), others use the same method as OCUnit outlined above.

### Asynchronous testing
Kiwi is the only framework that supports Asynchronous testing out of the box. This is due to Kiwi's BDD style testing, where it's not so much about Unit testing, but a combination of Unit Testing and Integration testing, forming a behaviour. Personally, this alone is enough to warrant a huge win for Kiwi.

### A note about Mocking Objects
As mentioned in OCUnit, mocking objects with OCMock is a solution to asynchronous testing. However, it is useful in much more. While this was not discussed in this article, it should be noted that Kiwi supports it's own mocking implementation, and appears to be rather easy to use.

## Conclusion
In conclusion, each of these frameworks have strengths and weaknesses, and using a hybrid approach amongst them is definitely possible, and probably needed at some point. However, although Kiwi has a bit of a harder time with Automated testing, it's strengths of Asynchronous testing, ease of interpretation, native support of mocked objects, and easy to write tests cannot be ignored. The Kiwi framework will make up the bulk of our tests, with OCUnit most likely playing a support role if it is ever needed.

*This post is the second in a 3-part series on how Magnetic Bear Studios manages its quality assurance process.*