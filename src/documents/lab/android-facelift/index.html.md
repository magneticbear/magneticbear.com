---
layout: 'post-lab'
title: 'An Android Facelift'
author: 'adrian'
nav: 'lab'
date: 2013-02-25 17:32
short_url: 'mgn.tc/droidlift'
---
To make a version of an Android app for each supported combination of screen size, density, and API level - would land you with over 300 versions to develop and maintain (compare to roughly 10 versions for iOS). However the Android SDK has been supporting fluid layouts, and a full toolbox of customizable components since day 1. In theory, this allows developers to develop one version that will function on the majority of devices.

---

And so we draw the line between function and style.

In terms of functional complexity, most apps are painfully simple - often serving only one or two major functions. Consider the app you use for text messaging, its functions are: sending and receiving text messages, and storing them chronologically. A simple exercise even for a junior developer. So of the myriad of app choices available to us - why is it we choose one over another?

Is it the font, or maybe that particular shade of green? Or could it be the ratio of padding to screen size? The cruel reality is that it's everything, all at once. Every app is a combination of innumerable factors, all of which must be carefully controlled and balanced - a 3 pixel offset can make a substantial impact on your user base. It's every developer's responsibility to ensure the final product not only behaves as intended, but also matches the design mockups.

With over 300 build targets requiring pixel perfect design, and an experience that has to feel identical whether you're on a tablet, your new smartphone, or that old phone from 4 years ago - well...

*Welcome to the Android Jungle.*

**Navigating the glass tower of Eclipse and the Android Development Kit**

You may have used Eclipse, Java and XML your whole life - but none of that matters in the world of the Android Development Kit.  For every problem there is a 'Java' solution, and then there is an 'Android' solution.  Occasionally the two are one and the same, but almost exclusively for problems that are inconsequential. Most of the time, the Java paradigm of heavy overengineering does not work in an 'Activity' and 'Intent' based environment, but instead leads to whole activity memory leaks, and often untraceable `NullPointerExceptions`. There is almost always a simpler, less intrusive way to do any task.

Most apps are so simple, they only require one instance of each custom class and associated style (eg. custom 'pay' button). So why add bulk by having the class and associated style at all? Classes and styles allow reusability throughout your app, but if you have no need to reuse - why go that extra mile? Tight code is easier to maintain in every situation. *Every* situation. Being able to change every element in an activity's layout inside one file, will save you endless frustration (especially in Eclipse).

When comes time to test, Google provides a virtual machine for emulating devices of almost any imaginable screen size and capacity. This allows for quick testing of major layout parameters under a large number of different scenarios.

Unfortunately, many new developers fall into the trap of developing their app for simulators; a layout being displayed on a simulated GalaxyS2 is noticeably different from how the layout is displayed on a physical GalaxyS2. The simulator will also happily allocate gigabytes worth of memory for your app (as default behaviour), whereas a physical device will forcefully terminate your app at as little as 20 megabytes. If you want to develop for Android, you absolutely require at least one physical device. *Ideally* a major production would have upwards of 100 devices of various sizes and API versions to develop with concurrently.

When it comes down to it, the cardinal rule is: for every 20 minutes of functionality development (eg. receiving a text message), you should expect 3-6 hours of tweaking layout parameters to make that functionality display properly across all devices (eg. showing that text message properly on screen).

Masochism aside, I love being an Android developer. Working on such an open platform gives you free reign, unlike iOS development where your code needs to be signed and approved by Apple - Google encourages hacking on their systems, and making things do what they weren't supposed to. Android is about flexibility and innovation - that is, if you're ready to get your hands dirty.

**"Android doesn't support that"; learning to roll everything from scratch**

*For any manual task that must be completed, if a tool can be created and used to complete that task in less time than completing the task manually - make the tool.*

Forget everything you know about reusability, platform support, and every case you won't face. Tools are almost always overlooked for their high cost of development, but as any developer will tell you it takes no time to get to 90% completion, and all the time to get that last 10%. So don't write 100% tools, make gaudy interfaces, write painfully thin documentation, and support only the edge cases you know you will face. Once the tool has done its job - abandon it in a repository somewhere, never to be looked at again. The idea being that developing a thin one-off tool for the same task twice, is faster than writing a strong tool once and trying to maintain it, or to adapt it to a new situation.

At first it may seem awkward rewriting the same functionality over and over, but if done write - every iteration will be better, faster and more elegant than the one before. The confidence and momentum you carry from rolling out tools when you need them, will directly translate back into the rest of your development.

Long story short: a tool that takes 6 hours to write can last the duration of a product lifecycle - and can save days of repetitive and tedious work.

`adrian_out();`