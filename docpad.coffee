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
				Magnetic Bear Studios makes beautifully crafted apps for iOS and Androdi.
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				apps, mobile, ios, iphone, android, ipad, ux, user experience, ottawa
				"""

			authors: [
						{'nick': 'mbs', 'pic': 'mbs.png', 'name': 'MBS', 'email': 'info@magneticbear.com', 'github': 'magneticbear', 'twitter': 'magneticbear', 'title': '', 'tagline': 'BEAUTIFULLY CRAFTED APPS','bio': ''},
						{'nick': 'jp', 'pic': 'JP.jpeg', 'name': 'JP Simard', 'email': 'jp@magneticbear.com', 'github': 'jpsim', 'twitter': 'simjp', 'title': 'Founder & CEO', 'tagline': 'No time for this shit...', 'bio': 'iOS+Android developer at @magneticbear studios (founder), electrical engineer, musician, runner, jazz aficionado, fake graphic designer'},
						{'nick': 'mo', 'pic': 'Mo.jpeg', 'name': 'Mo Mozafarian', 'email': 'mo@magneticbear.com', 'github': 'mo-mozafarian', 'twitter': 'M_Mozafarian', 'title': 'Creative Director', 'tagline': 'Stuff I think of .oO','bio': 'Designer'},
						{'nick': 'adrian', 'pic': 'Adrian.jpeg', 'name': 'Adrian Seeley', 'email': 'adrian@magneticbear.com', 'github': 'adrianseeley', 'twitter': 'adrnsly', 'title': 'Developer', 'tagline': 'I\'m the big data guy...','bio': 'Data Scientist, and Magnetic Bear, at Magnetic Bear Studios'},
						{'nick': 'stu', 'pic': 'Stu.jpeg', 'name': 'Stuart Macgregor', 'email': 'stuart@magneticbear.com', 'github': 'stumac', 'twitter': 'macgregor_stu', 'title': 'Developer', 'tagline': 'I write stuff...','bio': 'Mobile Applications Developers at Magnetic Bear Studios. Programmer, strength enthusiast, hater of all things functional'},
						{'nick': 'Brandon', 'pic': 'Brandon.png', 'name': 'Brandon Chatreau', 'email': 'brandon@magneticbear.com', 'github': '', 'twitter': 'kipsmithers', 'title': 'Business Development', 'tagline': 'I translate code...','bio': 'I like chicken Wings. Oh no I love them!!!'},
						{'nick': 'wendy', 'pic': 'Wendy.jpeg', 'name': 'Wendy Ly', 'email': 'wendy@magneticbear.com', 'github': '', 'twitter': 'lovewendyxo', 'title': 'Designer', 'tagline': 'I love stuff...','bio': 'I’m a 22 year old graphic designer residing in Ottawa, Ontario. I graduated from the graphic design program in 2012 at Algonquin College.'}]

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