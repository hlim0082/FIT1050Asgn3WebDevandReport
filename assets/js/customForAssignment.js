/*
	custom.js
	University Finance Club — custom interactivity
	Two features beyond the template is as following!:
	  1. FAQ accordion (expand/collapse with full ARIA + keyboard support)
	  2. Dark mode toggle
*/

(function () {
	'use strict';

	/* -------------------------------------------------------------
	 * 1. FAQ accordion
	 * Each .faq-question button toggles its associated .faq-answer.
	 * aria-expanded and the hidden attribute are kept in sync so
	 * screen readers and the visual layout always agree.
	 * ----------------------------------------------------------- */
	function setupFaq() {
		var questions = document.querySelectorAll('.faq-question');
		questions.forEach(function (btn) {
			btn.addEventListener('click', function () {
				var expanded = btn.getAttribute('aria-expanded') === 'true';
				var answerId = btn.getAttribute('aria-controls');
				var answer = document.getElementById(answerId);

				btn.setAttribute('aria-expanded', String(!expanded));
				if (answer) {
					if (expanded) {
						answer.setAttribute('hidden', '');
					} else {
						answer.removeAttribute('hidden');
					}
				}
			});
		});
	}

	/* -------------------------------------------------------------
	 * 2. Dark mode toggle
	 * Toggles a `dark-mode` class on <body>. Choice is saved in
	 * localStorage under "ufc-theme" so it survives page reloads.
	 * On load, the saved preference (or the system preference, if
	 * none) is restored before the first paint of any later content.
	 * ----------------------------------------------------------- */
	var STORAGE_KEY = 'ufc-theme';

	function applyTheme(theme) {
		var isDark = theme === 'dark';
		document.body.classList.toggle('dark-mode', isDark);
		var btn = document.getElementById('theme-toggle');
		if (btn) {
			btn.setAttribute('aria-pressed', String(isDark));
			btn.textContent = isDark ? 'Light mode' : 'Dark mode';
		}
	}

	function setupTheme() {
		var saved = null;
		try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage may be blocked */ }

		var initial;
		if (saved === 'dark' || saved === 'light') {
			initial = saved;
		} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			initial = 'dark';
		} else {
			initial = 'light';
		}
		applyTheme(initial);

		var toggle = document.getElementById('theme-toggle');
		if (toggle) {
			toggle.addEventListener('click', function (e) {
				e.preventDefault();
				var nowDark = !document.body.classList.contains('dark-mode');
				var next = nowDark ? 'dark' : 'light';
				applyTheme(next);
				try { localStorage.setItem(STORAGE_KEY, next); } catch (e2) { /* ignore */ }
			});
		}
	}

	/* -------------------------------------------------------------
	 * 3. Accessibility patch for Forty's tile overlay links
	 * The template's main.js clones each tile's .link into an empty
	 * .link.primary anchor that covers the whole tile for the click
	 * animation. Because it has no text, screen readers announce an
	 * unnamed link. Since it duplicates the visible titled link, we
	 * hide it from assistive tech and remove it from the tab order.
	 * ----------------------------------------------------------- */
	function patchTileLinks() {
		var overlays = document.querySelectorAll('.tiles article a.link.primary');
		overlays.forEach(function (a) {
			a.setAttribute('aria-hidden', 'true');
			a.setAttribute('tabindex', '-1');
		});
	}

	/* -------------------------------------------------------------
	 * Boot
	 * ----------------------------------------------------------- */
	function init() {
		setupFaq();
		setupTheme();
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
	// Forty creates the overlay links on window load; run after it.
	window.addEventListener('load', function () {
		setTimeout(patchTileLinks, 0);
	});
})();
