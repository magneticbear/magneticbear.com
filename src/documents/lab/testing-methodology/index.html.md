---
layout: 'post-lab'
title: 'Testing Methodology'
author: 'stu'
nav: 'lab'
date: 2013-02-25 18:05
short_url: 'mgn.tc/testmethod'
---
As the `<<Insert whatever my main role is here>>`, it's my job to ensure that bugs are kept to a minimum in our products. Recently, we've decided to really streamline the process of testing, and how our testing methodology will work in concert with the rest of our development team.

---

### Goal

The Goal of creating our testing methodology is simple. To provide the fastest and easiest way to catch bugs and errors, while keeping things as simple as possible for both the developer and tester.

### Outline

Ideally, we'd like to be catching bugs as their being developed. Similar to how Test Driven Development works. With that in mind, whenever a developer creates a new feature branch, a test feature branch is created in parrallel with it. The test branch will have the tests laid out that best describe how the feature should work, as well as any possible edge cases. When the Developer is ready to test these features, he/she will send a pull request to the test feature branch. The tester will accept this pull request (after reviewing the code), and run the appropriate tests. If all the tests pass, the branch can be merged into the development branch, and eventually, into master. If not, the Tester will outline what went wrong, and send it back to the developer.

<<Insert Images Here>>

Testing is considered a key part of a product at MBS, and while we'll never ship completely bug free code, it's embarrassing to hand over a product to the public, only to realize a crippling bug managed to make it's way through to deployment. By testing the feature branches as they're developed, as well as a full CI solution in the development and master branches, we're minimizing the risk of bugs, as well as having an idea where to look if one does pop up. This peace of mind really helps us sleep at night.

### What Needs to be tested?

If testing were as simple as running through the app once it's done, we'd have perfect products. Obviously this is not the case. So testing needs to be broken down into parts.

#### Logic
Logic testing tests if the product handles data as expected. If a method takes in certain values, changes them, and outputs expected values, these need to be tested. What if it's bad data? What if the result isn't what is expected? What about special cases? All of these things need to be tested for a product to be bug free.

### UI Testing
Tests the User Interface of the product (if there is one), If a button is clicked, is the proper method called? If a label or picture is supposed to change based on a given event, does it? A lot of the time, these can't be tested until the logic tests are completed due to the fact that without the proper response from a logical method, the display would be incorrect. Often times, UI testing is tested with what's known as Integration testing.

#### Offline Testing
Often times, our products have an element of connectivity to them. This is a variable that cannot always be accounted for. As such, how can we test parts of the product when there's no network? Offline testing creates tests that always return the expected network value (by mocking the network data), and testing what happens if there's no network connectivity (do we have something in place in the event of no signal?).

#### Online testing
Assuming the back end of the product is up and running, this tests everything in a cohesive manner. By testing all parts of the application and how they work together, we can see how everything behaves. Generally speaking, if the other tests passed without issue, this should as well. But combining everything can occasionally have unexpected side affect. By testing for this, we can minimize bugs even further, for little to no extra work.

### Types of Testing Used

There are various types of testing solutions, each possessing their own strengths and weaknesses. By combining them in the right way, we can maximize our testing coverage of the product.

#### Manual Testing

The most obvious and oldest of the testing solutions. Take a device, run your product on it, and try to break it by hand. While easy, this method is wraught with weaknesses. It makes tests harder to repeat (essential in bug hunting), is hard to keep track of, and requires a lot of time to complete. Nevertheless, there are some things that simply require Manual testing. By using manual testing judiciously, many bugs can be found and fixed.

#### Unit Testing

A testing method popularized by the TDD Community, Unit testing is the primary way we will use to conduct logic tests. By eliminating affects after each test (something UT provides) we can be sure the results of one test won't affect another run after it.

#### Integration Testing

Integration testing refers to the automated testing of an entire application. If you take the UI, the logical models, and the network results (either mocked or real), and integrate them together, do the expected results happen? Most of the time, this is the way UI testing will be conducted. 

### How each framework will work together.

By using each Manual, Unit, and Integration Testing in the proper contexts, we can assure very strong code coverage.

#### Unit Testing
* All Logic tests
* testing network responses
* backend development

#### Manual Testing
* tests that cannot be completed when inside the product (say, when an app tries to exit and re-enters, or motion control is needed).

#### Integration testing
* tests the UI and UX
* test how all parts of the product work together, look for side affects.

### Conclusion

By utilising a hybrid of the shown testing possibilities, it is possible to have proper coverage of most written code. By keeping the testing and feature branches seperate, we ensure the developer can work with minimal adjustments, while still maintaing strong bug catching abilities. By testing each feature seperately, and again when all features combine, we can catch issues as they appear in the feature, and any possible side affects of the integrated feature. This method will help keep our code lean, as well as the entire project lean, yet still have enough coverage to minimize possible issues.