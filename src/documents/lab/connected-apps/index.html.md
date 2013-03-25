---
layout: 'post-lab'
title: 'Connected Apps'
author: 'adrian'
nav: 'lab'
date: 2013-03-25 14:05
short_url: 'mgn.tc/connectedapps'
---
Today as a developer, you needn't ever worry about web connectivity;
Unless you actually want a job - in which case it's time to start worrying.

---

Gone are the days of local-only utility apps; Everyone has an app for alarms, notes, and listmaking. Those who don't know the app store is heavily saturated with thousands of free and paid options to choose from - and trust me, they're marketing budgets are way bigger than yours (100k-200k+). Some companies even operate on a model where their apps virtually hemmorage money, but they make bank on selling their userbase to 3rd parties. In-app ad revenue is also an unfortunate pipedream that many new developers plan to cash in on - only to find themselves stocking up on instant ramen so they don't starve to death.

Still don't buy it? As a quick excersise, think of the last 5 apps you used on your mobile device - mine were:
Tumblr, Facebook, Gmail, Google Maps, and Twitter

Notice how all those apps also exist as websites? Starting to see the pattern yet?
Today's market *demands* connectivity from every app they use.  Even the built in camera app has been replaced with heavily connected Instagram-esque alternatives.

Over the years developers have been forced to adapt to this changing paradigm of development, and with this change has come a whole new ecosystem of connected development driven frameworks and languages. Ten years ago you would have been forced to use PHP, Java or equally awful alterneratives (rails im looking at you), but today a fully scalable web api can be as little as one file with 100 lines of code. That being said, the exact same API could easily be thousands of lines spread over hundreds of files, which brings me to the main topic of this article:

## Web Connectivity, You're Doing It Wrong: How Best Practices Force Overengineering 

Here is our first scenario:

1. Our app needs to send data to the server.
2. You Google 'android send data to server'.
3. Big shiny package 'x' with a heavy marketting budget says their middleware will do all the hard parts for you.
4. You say 'Boss look at this big shiny package, it'll save us weeks!'.
5. Boss says 'I love money! This will save us a fortune!'.
5. Server goes live.
6. More than 10 people connect.
7. Server goes down, you have no idea what failed or how, you're left staring at your big shiny black box middleware package - tail between your legs.
8. Your app's MVP fails right out of the gate, you've blown your one and only launch chance, and no one will every hire you again.

What an awful experience, but thankfully some kind soul (broke dumbass) needs an app and has gracefully offered you a job, and with it a chance to redeem yourself.

Round two:

1. Our app needs to send data to the server.
2. You spend weeks reading up on every best practice you can find.
3. You say 'Boss I'm going to give you a great solution, but it's going to take four times as long to implement because of all these best practices I read about.'.
4. Boss says 'I love money! This will cost us a fortune!... But I know my hyperinnovative-social-gamechanging-adpacked-revolution app will succeed no matter what, so lets take the risk!'.
5. You pack in every best practice, comment every line, follow every rule of thumb - hell you even perform some ritualistic blood sacrifice to the connectivity gods - this time will be different, you learned from your mistakes last time!
6. Server goes live.
7. First person tries to connect.
8. Server goes down, you have no idea what went wrong - you spend hours, days even - combing through fields of classes, functions, and comments, looking up your own error codes only to discover you still have no freaking idea what went wrong.
9. Your app's MVP fails right out of the gate, you've blown your one and only launch chance, and no one will every hire you again.

Wow, that was even worse than round one - this time you can't even blame some junky middleware package, this time it was all on you, and you failed hard. So here you are jobless, hungry, the rent is late and you're more pissed than Mel Gibson when they killed his woman in Braveheart. You know there must be some magical solution; you've used apps that do what you are trying to do - so why can't you make this work? 

The next day - by some divine miracle - another job offer appears in your inbox. You start to think 'hey, maybe I *can* do this!'.  So you slather some blue paint on your face, rowdy up the locals and let roar your greatest warcry. TO BATTTTTLLLEEEEEE!

Round Three:

1. Our app needs to send data to the server.
2. You finally realize that any idiot can label something a 'best practice' and you decide 'hey, maybe I should think for myself for once - it's not like anyone else is going to be held accountable when this fails.'.
3. You say 'Boss, middleware is for chumps, and best practices go out of date faster than Lady Gaga's wardrobe, I'm going to build you the leanest, meanest mobile app anyone has ever seen.'.
4. Boss says 'I love money! Sounds like you know what you're doing, I'll leave you to it!'.
5. You make countless iterations, every time making the code base leaner and tighter. Testing and retesting. You've seen how things fail, you know where to spend extra time on bulletproofing, and you have learned that comments and best practices will only obfuscate your code base - hiding errors and wasting precious moments during production failure. This time you design with failure in mind, finally you understand that everything fails on a long enough time line. And this time you are ready, you know every line of code inside out. You can already *feel* which areas are more likely to fail, and why.  You start to look at your code as always broken, measuring just how much pressure it can take before failing.
6. Server goes live.
7. More than 10 people connect.
8. Server goes down - but you saw it coming, you planned for this, within 5 minutes you've implemented a fix and pushed it to production, the server goes back up and hundreds of users start using your app without the slightest hiccup.
9. Your MVP is a success! Your boss pats you on the back as you blow the smoke from the end of your six-shooter. You pulled it off!

At this point you're probably thinking 'I should write up some best practices so no one will ever make the mistakes I made!', but luckily I'm here to slap you in the face and say 'NO! BAD PROGRAMMER! BAD!'.

Either:
A) your project is similair enough to something out there already, in which case stop wasting your time by bloating and already bloated market, 
B) what you think is a 'best practice' is actually a basic programming concept that you should already know if you're calling yourself a programmer, or 
C) it really is a 'best practice' in this circumstance, but sharing it will only encourage newcomers to attempt to shoehorn their problem into your solution, leading them horribly astray and causing them to forever curse your name for giving them bad advice.

Connectivity is easier than ever, but that doesn't mean it's easy - not even freaking close.

Do you understand every layer of the OSI model?
Do you understand why those layers exist and how to exploit their architecture to do your bidding?
Do you understand the differences between TCP and UDP, and have you tried both in their ideal scenario?
Have you read all 85 pages of the TCP RFC793 which lays out all design paradigms for the protocol?
Do you even know what REST means or why it was created?
Do you even know what a protocol is for that matter?

If you can't explain to me in intricate detail **everything** your technology is supported by - you aren't even close to being ready to connecting anything. It's one steep learning curve and 99% will never make it up the slope, but for those who do - awaits the land of milk and honey, where you stop applying for jobs, and jobs start applying for you.

<code>adrian_out();</code>