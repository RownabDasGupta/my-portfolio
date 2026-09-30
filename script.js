document.documentElement.classList.add("js"); // enables scroll-reveal styles

/* ==========================================================================
   ROWNAB DAS GUPTA — PORTFOLIO SCRIPTS
   1. Mobile nav toggle
   2. Close nav when a link is tapped (mobile)
   3. DSA profile tabs
   4. Native Mailto Form Redirection Engine
   5. Forced CV Download (desktop + mobile safe)
   6. Footer year
   ========================================================================== */

// ---------- 1. Mobile nav toggle ----------
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
	const isOpen = navMenu.classList.toggle("open");
	navToggle.classList.toggle("open", isOpen);
	navToggle.setAttribute("aria-expanded", isOpen);
});

// ---------- 2. Close nav on link click (mobile) ----------
document.querySelectorAll(".nav-link").forEach(link => {
	link.addEventListener("click", () => {
		navMenu.classList.remove("open");
		navToggle.classList.remove("open");
		navToggle.setAttribute("aria-expanded", "false");
	});
});

// ---------- 3. DSA profile tabs ----------
const dsaTabButtons = document.querySelectorAll(".tab-links-dsa");
const dsaTabPanels = document.querySelectorAll(".tab-contents-dsa");

dsaTabButtons.forEach(button => {
	button.addEventListener("click", () => {
		dsaTabButtons.forEach(btn => btn.classList.remove("active-link-dsa"));
		dsaTabPanels.forEach(panel => panel.classList.remove("active-tab-dsa"));

		button.classList.add("active-link-dsa");
		document.getElementById(button.dataset.tab).classList.add("active-tab-dsa");
	});
});

// ---------- 4. Native Mailto Form Redirection Engine ----------
const contactForm = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

contactForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name = document.getElementById("form-name").value;
	const email = document.getElementById("form-email").value;
	const subject = document.getElementById("form-subject").value;
	const message = document.getElementById("form-message").value;

	const targetEmail = "rownab.dg21@gmail.com";
	
	// Construct the pre-populated mail formatting layout
	const mailSubject = encodeURIComponent(`Portfolio Inquiry: ${subject}`);
	const mailBody = encodeURIComponent(
		`Hello Rownab,\n\nYou have received a new communication via your Portfolio Contact system.\n\n` +
		`Sender Name: ${name}\n` +
		`Sender Email: ${email}\n\n` +
		`Message Details:\n${message}\n`
	);

	// Generate and transition context stack directly to mail window pipeline
	const mailtoUrl = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;
	
	try {
		window.location.href = mailtoUrl;
		formMsg.style.color = "var(--accent)";
		formMsg.textContent = "Launching your system's native mail client to dispatch your message...";
		contactForm.reset();
		setTimeout(() => { formMsg.textContent = ""; }, 6000);
	} catch (error) {
		formMsg.style.color = "#ff6b6b";
		formMsg.textContent = "Unable to start local mail automatically. Please email rownab.dg21@gmail.com directly.";
		console.error("Form redirect failed: ", error);
	}
});

// ---------- 5. Forced CV Download (desktop + mobile safe) ----------
// Plain <a download> is unreliable on several mobile browsers, so the CV is
// fetched as a blob and saved through a throwaway link. This never
// navigates the portfolio tab away — it only triggers the file save.
/* const cvLinks = document.querySelectorAll(".cv-download-link");
const CV_PATH = "Images/Rownab_Das_Gupta_-_2026.pdf";
const CV_FILENAME = "Rownab_Das_Gupta_CV.pdf";

cvLinks.forEach(link => {
	link.addEventListener("click", (e) => {
		e.preventDefault();

		fetch(CV_PATH)
			.then(res => {
				if (!res.ok) throw new Error("CV file not found at " + CV_PATH);
				return res.blob();
			})
			.then(blob => {
				const blobUrl = URL.createObjectURL(blob);
				const tempLink = document.createElement("a");
				tempLink.href = blobUrl;
				tempLink.download = CV_FILENAME;
				document.body.appendChild(tempLink);
				tempLink.click();
				document.body.removeChild(tempLink);
				URL.revokeObjectURL(blobUrl);
			})
			.catch(error => {
				// Fallback: let the browser handle the plain link/download attribute directly.
				console.error("CV auto-download failed, falling back to direct link: ", error);
				window.location.href = CV_PATH;
			});
	});
});
*/


// ---------- 6. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- 7. Animations: scroll progress, reveal on scroll, stat counters ----------
(function () {
	const bar = document.createElement("div");
	bar.className = "scroll-progress";
	document.body.appendChild(bar);
	window.addEventListener("scroll", () => {
		const h = document.documentElement.scrollHeight - window.innerHeight;
		bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
	}, { passive: true });

	const groups = [".section-title", ".about-photo", ".about-text", ".timeline-item", ".skill-group", ".ai-tool-chip", ".cert-card-link", ".work-card", ".dsa-image", ".dsa-content", ".contact-left", ".contact-right"];
	const targets = [];
	groups.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
		el.classList.add("reveal");
		el.style.setProperty("--d", (i % 3) * 0.1 + "s");
		targets.push(el);
	}));

	const io = new IntersectionObserver(entries => {
		entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
	}, { threshold: 0.12 });
	targets.forEach(el => io.observe(el));

	// Count-up for hero stats (keeps prefix/suffix such as ~, +, %)
	document.querySelectorAll(".stat-number").forEach(el => {
		const m = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/);
		if (!m) return;
		const [, pre, num, suf] = m, end = +num;
		let t0 = null;
		const step = ts => {
			t0 = t0 || ts;
			const p = Math.min((ts - t0) / 1400, 1);
			el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
			if (p < 1) requestAnimationFrame(step);
		};
		el.textContent = pre + "0" + suf;
		requestAnimationFrame(step);
	});
})();
