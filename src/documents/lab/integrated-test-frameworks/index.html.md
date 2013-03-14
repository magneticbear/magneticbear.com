---
layout: 'post-lab'
title: 'Integration Test Frameworks'
author: 'stu'
nav: 'lab'
date: 2013-03-15 08:23
short_url: 'mgn.tc/itfc'
---
Like Unit Testing Frameworks, there are an abundance of Integration and UI testing frameworks available. We'll be focusing on three of them: [KIF](https://github.com/square/KIF), [UIAutomation](http://developer.apple.com/library/ios/#documentation/DeveloperTools/Reference/UIAutomationRef/_index.html), and [Frank](http://testingwithfrank.com/).

Unlike my previous [testing frameworks comparison](/lab/ios-unit-testing), this article will be much more concise, with examples being provided in a github repository instead of inline here. This should keep everyone from falling asleep mid-article.

---

## KIF
KIF (Keep It Functional) is the current integration testing framework we use. It has an active community, and a well thought out framework created by the clever developers at Square.

### Setup
KIF integrates incredibly easily into an application. With Cocoapods, it's literally as simple as setting up a new target, installing via Cocoapods, and writing your tests. However, it's incredibly important that KIF tests stay in their own target, due to the fact that it uses undocumented API's. If these got into production code, they would never pass Apple's App Store review.

KIF is also written in Objective-C, which makes it incredibly easy for developers to write tests (something we focus on here). Unlike UIAutomation and Frank, which are more suited towards typical QA analysts.

KIF is not without its downsides though. Due to the nature of automated testing, there have been some noted bugs in timing and finding the right element at the right time (in some cases, I've had to intentionally wait a second or two before looking for an element because it hadn't been fully loaded by the simulator yet). Also, KIF requires each interactive element to have an accessibility label. Sometimes these labels are implicitly created by Xcode, sometimes not. It's important for both the developer and the tester to keep in communication, and keep these elements labeled and up to date, or the tests will break.

Finally, when running KIF through Jenkins, the developer must provide their own script in order to catch the results from the console. For a full reference on how to get Jenkins and KIF to work well together, see [here](http://www.leonardoborges.com/writings/2012/05/03/build-automation-with-xcode-4-dot-3-kif-and-jenkins/).

## UIAutomation
UIAutomation was introduced by Apple in Xcode 4, and is the default UI/Integration testing suite in Xcode. All tests are managed in JavaScript (which I found to be somewhat odd).

### Setup
UIAutomation is run through Instruments.app. Launching it is relatively simple: just click the UIAutomation button, and start writing the script. Out of the three, this setup is by far the easiest.

Unfortunately, UIAutomation leaves a lot to be desired. It runs into the same problems as KIF in that all elements must be labeled correctly. Furthermore, with javascript syntax, each developer now must learn two languages to test the application (granted, JavaScript is a well known language). I find Instruments.app quite clunky as well. Finally, while it is possible to run UIAutomation in Jenkins, KIF makes the process easier.

## Frank
Frank is the iOS implementation of Cucumber. Written in ruby, Frank stays almost entirely outside of the application project completely.

### Setup
Frank is installed through the gem package manager. After that, you simply run `frank setup`, `frank build` and `frank launch` to launch to the app in the simulator.

Tests are written in ruby. If a tester enjoyed ruby, I would recommend this framework. I don't fall in this category.

While Frank is significantly better than UIAutomation, and runs with Jenkins reasonably well (probably the best out of the three), its heavy dependence on ruby is enough to throw off some objective-C developers. Furthermore, it appears that many of the things Frank does can be done with Kiwi (which makes sense, given that they're both designed for BDD). To be frank (no pun intended), if a developer is using Kiwi, I see no reason to use Frank.

## Conclusion
In conclusion, KIF appears to be the best tool for the job as it stands right now. UIAutomation may have a place if it were to allow the exiting and re-entrance of an application, it would be more useful. Frank has no place in our testing suite if we're already using Kiwi. If other developers are not using Kiwi, it would make sense to look into Frank a bit more heavily.

*This post is the third in a 3-part series on how Magnetic Bear Studios manages its quality assurance process.*