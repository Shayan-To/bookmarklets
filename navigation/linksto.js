/**
 * Highlight all links and images pointing to the given domain name.
 *
 * @title Links to…
 */
(function () {
	var all = document.querySelectorAll('[href^="http://jan.moesen.nu"], [href^="//jan.moesen.nu"], [src^="http://jan.moesen.nu"], [src^="//jan.moesen.nu"], [src*="janmoesen"]');
	if (!all.length) {
		return;
	}

	/* Use four overlays to cut out a rectangular area around the element, like the opposite of the CSS clip property. */
	var overlays = Array.prototype.slice.call(document.querySelectorAll('div[id^="janbmLinksToOverlay"]'));
	if (!overlays.length) {
		overlays = [];
		for (var i = 0; i < 4; i++) {
			overlays[i] = document.createElement('div');
			document.body.appendChild(overlays[i]).setAttribute('id', 'janbmLinksToOverlay' + i);
		};
	}

	document.janbmLinksToIndex = 'janbmLinksToIndex' in document
		? document.janbmLinksToIndex + 1
		: 0;
	if (document.janbmLinksToIndex >= all.length) {
		/* Clear the spotlighting when we have done them all. */
		overlays.forEach(function (overlay) {
			overlay.style.display = 'none';
		});

		delete document['janbmLinksToIndex'];
		return;
	}

	var element = all[document.janbmLinksToIndex];
	element && element.scrollIntoView();

	var left = 0, top = 0, width = element.offsetWidth, height = element.offsetHeight;
	var tmpElement = element;
	do {
		left += tmpElement.offsetLeft;
		top += tmpElement.offsetTop;
	} while ((tmpElement = tmpElement.offsetParent));
	if (element.nodeName.toLowerCase() === 'a' && element.children.length === 1) {
		/* Images (and possibly other elements) in links are higher than the links themselves. */
		height = Math.max(element.offsetHeight, element.children[0].offsetHeight);
	}

	/* Cut-out using overlays:
	 * AAAAAAA
	 * BB   CC
	 * DDDDDDD
	 */
	var overlayStyle = 'display: block; position: absolute; left: {left}px; top: {top}px; width: {width}px; height: {height}px; background: #333; opacity: 0.85;';
	overlays[0].setAttribute('style', overlayStyle
		.replace('{left}', 0)
		.replace('{top}', 0)
		.replace('{width}', document.body.scrollWidth)
		.replace('{height}', top)
	);
	overlays[1].setAttribute('style', overlayStyle
		.replace('{left}', 0)
		.replace('{top}', top)
		.replace('{width}', left)
		.replace('{height}', height)
	);
	overlays[2].setAttribute('style', overlayStyle
		.replace('{left}', left + width)
		.replace('{top}', top)
		.replace('{width}', document.body.scrollWidth - width - left)
		.replace('{height}', height)
	);
	overlays[3].setAttribute('style', overlayStyle
		.replace('{left}', 0)
		.replace('{top}', top + height)
		.replace('{width}', document.body.scrollWidth)
		.replace('{height}', document.body.scrollHeight - height - top)
	);
})()
