# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:

		# Specify some site properties
		site:
			# The production url of our website
			url: "http://magneticbear.com"

			# The default title of our website
			title: "Magnetic Bear Studios"

			# The website description (for SEO)
			description: """
				Magnetic Bear Studios makes beautifully crafted apps for iOS and Android.
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				apps, mobile, ios, iphone, android, ipad, ux, user experience, ottawa, canada
				"""

			# The main site author's name and email
			author: "Magnetic Bear Studios"
			email: "info@magneticbear.com"

			# The website authors along with their nicknames, pictures, full names, emails, github accounts, twitter handles, titles, taglines and bios
			authors: [
						{'nick': 'mbs', 'pic': 'mbs.png', 'name': 'MBS', 'email': 'info@magneticbear.com', 'github': 'magneticbear', 'twitter': 'magneticbear', 'title': '', 'tagline': 'BEAUTIFULLY CRAFTED APPS','bio': ''},
						{'nick': 'jp', 'pic': 'JP.jpeg', 'name': 'JP Simard', 'email': 'jp@magneticbear.com', 'github': 'jpsim', 'twitter': 'simjp', 'title': 'Founder & CEO', 'tagline': 'My articles...', 'bio': 'JP is our fearless leader. The force behind Magnetic Bear’s vision and purveyor of smooth, silky jazz music. He is the main man always working extremely hard — eats, sleeps and codes! He’s a machine trapped in a man’s body!'},
						{'nick': 'mo', 'pic': 'Mo.jpeg', 'name': 'Mo Mozafarian', 'email': 'mo@magneticbear.com', 'github': 'mo-mozafarian', 'twitter': 'M_Mozafarian', 'title': 'Creative Director', 'tagline': 'Stuff I think of .oO','bio': 'Mo is our idea guy. The man behind our top quality UX/UI... and resident Jimi Hendrix. The creative UX/UI master by weekday and video game lover by weekend.'},
						{'nick': 'adrian', 'pic': 'Adrian.jpeg', 'name': 'Adrian Seeley', 'email': 'adrian@magneticbear.com', 'github': 'adrianseeley', 'twitter': 'adrnsly', 'title': 'Developer', 'tagline': 'Big data stuff...','bio': 'Adrian is our prodigious genius and our data scientist guy. Genius — could code in his sleep like it’s no big deal. He’d rather recreate the wheel! Big data. Big man.'},
						{'nick': 'brandon', 'pic': 'Brandon.png', 'name': 'Brandon Chatreau', 'email': 'brandon@magneticbear.com', 'github': '', 'twitter': 'kipsmithers', 'title': 'Business Development', 'tagline': 'Real word coding','bio': 'Brandon is our nerdspeak-to-human translator. He is technically the voice of MBS; Energetic, tech savvy, enthusiastic and always down for beers. He is also our go-to man for finding good food in the neighbourhood.'},
						{'nick': 'stu', 'pic': 'Stu.jpeg', 'name': 'Stuart Macgregor', 'email': 'stuart@magneticbear.com', 'github': 'stumac', 'twitter': 'macgregor_stu', 'title': 'Developer', 'tagline': 'Blog and blurb...','bio': 'Stu is our one-man SWAT team. Our walking wikipedia. He knows about everything! Clever conversationalist — always has something interesting to say.'},
						{'nick': 'wendy', 'pic': 'Wendy.jpeg', 'name': 'Wendy Ly', 'email': 'wendy@magneticbear.com', 'github': '', 'twitter': 'ly_wendy', 'title': 'Designer', 'tagline': 'Pretty things I see...','bio': 'Wendy is our pixel conjuror. Master of all that is pixelated beauty. She is not much of talker but her work totally speaks for itself.'}]

		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
			# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

		# Get the prepared site/document description
		getPreparedDescription: ->
			# if we have a document description, then we should use that, otherwise use the site's description
			@document.description or @site.description

		# Get the prepared site/document keywords
		getPreparedKeywords: ->
			# Merge the document keywords with the site keywords
			@site.keywords.concat(@document.keywords or []).join(', ')

		getAuthor: (nick) -> return (item for item in @site.authors when item.nick == nick)
		getAuthorName: (nick) -> return (item.name for item in @site.authors when item.nick == nick)
		getAuthorTwitter: (nick) -> return (item.twitter for item in @site.authors when item.nick == nick)
		getAuthorPic: (nick) -> return (item.pic for item in @site.authors when item.nick == nick)

	# =================================
	# DocPad Events

	# Here we can define handlers for events that DocPad fires
	# You can find a full listing of events on the DocPad Wiki
	events:

		# Server Extend
		# Used to add our own custom routes to the server before the docpad routes are added
		serverExtend: (opts) ->
			# Extract the server from the options
			{server} = opts
			docpad = @docpad
}

# Export our DocPad Configuration
module.exports = docpadConfig