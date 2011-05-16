javascript:
/**
 * Make a page more readable by disabling all page styling and applying a
 * bare minimum of our own. Go to the first thing that looks like the start
 * of the actual content so no time is wasted scrolling past initial
 * navigation etc.
 *
 * @title Readable++
 */
(function read() {
	/* The more readable stylesheet. */
	var css = '@namespace svg "http://www.w3.org/2000/svg";
		* {
			line-height: 1.5;
		}
		body {
			max-width: 60em;
			margin: 0 auto;
			padding: 1em;
			font-family: "Calibri", sans-serif;
		}
		center, [align] {
			text-align: left;
		}
		b, i, u, s, strike, blink {
			font-weight: normal;
			font-style: normal;
			text-decoration: none
		}
		pre {
			padding: 1ex;
			border: 1px dotted;
		}
		code, pre, .syntaxhighlighter {
			font-family: "Consolas", monospace;
			font-size: small;
			background: #ffe;
		}
		img:not(:hover), input[type="image"]:not(:hover), object:not(:hover), embed:not(:hover), iframe:not(:hover), :not(svg|*) > svg|*:not(:hover) {
			opacity: 0.25;
		}
		.post_share, #janrain-social-sharebar {
			display: none;
		}
		iframe[src*="//www.facebook.com/plugins/like.php"], iframe.twitter-share-button {
			max-height: 4ex;
		}',

		/* The attributes to disable. */
		attrs = ['style', 'face', 'font@size', 'basefont@size', 'background', 'align', 'bgcolor', 'color', 'text', 'link', 'vlink', 'alink', 'hlink', 'align', 'border', 'frameborder', 'table@width', 'tr@width', 'td@width', 'th@width', 'table@height', 'tr@height', 'td@height', 'th@height', 'colspan', 'rowspan'],

		/* The selectors to try (in this order) for the first content element to scroll to. */
		contentSelectors = ['#article', 'article, .article, .articleContent', '#entry', '.entry, .post, .blogpost', '#content', '.content', '[id^="content"], [class^="content"]', '#main', '.main', 'h1', 'h2', 'big'],

		/* The stylesheet ID/HTML data attribute prefix to use */
		id = 'jan-css';

	/* The main function. */
	(function execute(document) {
		var all = Array.prototype.slice.call(document.getElementsByTagName('*')),
			ourStyleSheet = document.getElementById(id),
			allStyleSheets = Array.prototype.slice.call(document.styleSheets),
			matches;

		/* Add the custom stylesheet if necessary. */
		if (!ourStyleSheet) {
			(ourStyleSheet = document.createElement('style')).id = id;
			ourStyleSheet.innerHTML = css;
			document.head.appendChild(ourStyleSheet).disabled = true;
		}

		/* Toggle between our readable and the page's original stylesheet(s). */
		ourStyleSheet.disabled = !ourStyleSheet.disabled;
		allStyleSheets.forEach(function (styleSheet, i) {
			if (styleSheet.ownerNode !== ourStyleSheet)
			{
				/* Remember whether this stylesheet was originally disabled or not. We can't store on the CSSStyleSheet object, so use our DOM node. */
				if (ourStyleSheet[id + '-originally-disabled-' + i] === undefined) {
					ourStyleSheet[id + '-originally-disabled-' + i] = styleSheet.disabled;
				}

				if (ourStyleSheet.disabled) {
					/* Restore this stylesheet's original state. */
					styleSheet.disabled = ourStyleSheet[id + '-originally-disabled-' + i];
				} else {
					/* Disable this stylesheet when ours is enabled. */
					styleSheet.disabled = true;
				}
			}
		});

		/* Process all attributes for all elements. */
		all.forEach(function (elem, i) {
			attrs.forEach(function (attr, j) {
				/* Parse the attribute definition. Attributes can be restricted to certain elements, e.g. "table@width". */
				if (!(matches = attr.match(/([^@]+)@([^@]+)/)) || (elem.tagName && elem.tagName.toLowerCase() == matches[1])) {
					attr = matches ? matches[2] : attr;
					var names = { enabled: attr, disabled: id + '-' + attr };
					if (elem.hasAttribute(names.enabled)) {
						elem.setAttribute(names.disabled, elem.getAttribute(names.enabled));
						elem.removeAttribute(names.enabled);
					} else if (elem.hasAttribute(names.disabled)) {
						elem.setAttribute(names.enabled, elem.getAttribute(names.disabled));
						elem.removeAttribute(names.disabled);
					}
				}
			});
		});

		/* Recurse for frames and iframes. */
		try {
			Array.prototype.slice.call(document.querySelectorAll('frame, iframe, object[type^="text/html"], object[type^="application/xhtml+xml"]')).forEach(function (elem) {
				execute(elem.contentDocument);
			});
		} catch (e) {
			/* Catch exceptions for out-of-domain access, but do not do anything with them. */
		}
	})(document);

	/* Scroll to the first thing that looks like the start of the actual content. */
	if (location.hash) {
		contentSelectors.unshift(location.hash);
	}
	for (var i = 0; i < contentSelectors.length; i++) {
		try {
			var element = document.querySelector(contentSelectors[i]);
			if (element && element.offsetWidth && element.offsetHeight) {
				var top = 0;
				do {
					top += element.offsetTop;
				} while ((element = element.offsetParent));
				window.scrollTo(0, top);
				break;
			}
		}
		catch (e) {
			window.console && console.log('Readable++: bad selector:\n' + contentSelectors[i] + '\nException: ' + e);
		}
	}
})();