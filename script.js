
const $ = (id) => document.getElementById(id);

const promptInput = $("promptInput");
const canvas = $("websiteCanvas");

let currentTheme = "violet";
let currentLayout = "balanced";
let currentPrompt = "";
let generated = false;
let lastSiteTitle = "Your Brand";
let toastTimer;

const themeMap = {
  violet: { cls: "", accent: "#9b8cff", bg: "#17172b" },
  ocean: { cls: "theme-ocean", accent: "#45c4cf", bg: "#102d3a" },
  sunset: { cls: "theme-sunset", accent: "#ff9b72", bg: "#33231f" }
};

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function cleanText(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));
}

function hasAny(text, words) {
  return words.some(word => text.includes(word));
}

function pickTitle(prompt) {
  const p = prompt.toLowerCase();

  // Check specific business types before generic AI/startup terms.
  if (hasAny(p, ["plant", "nursery", "flower", "botanical"]))
    return "Green Haven";

  if (hasAny(p, ["coffee", "cafe", "café", "espresso"]))
    return "Ember & Oak";

  if (hasAny(p, ["restaurant", "food", "bakery", "recipe"]))
    return "Savor House";

  if (hasAny(p, ["fitness", "gym", "workout"]))
    return "Form & Function";

  if (hasAny(p, ["travel", "tour", "holiday", "vacation"]))
    return "Wanderly";

  if (hasAny(p, ["portfolio", "developer", "programmer", "java"]))
    return "Alex Morgan";

  if (hasAny(p, ["fashion", "clothing", "boutique"]))
    return "Thread & Style";

  if (hasAny(p, ["education", "school", "course", "learning"]))
    return "BrightPath";

  if (hasAny(p, ["beauty", "salon", "skincare"]))
    return "Glow Studio";

  if (hasAny(p, ["ai", "startup", "saas", "software"]))
    return "FlowPilot";

  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && ![
      "create", "build", "website", "modern", "beautiful",
      "responsive", "include", "using", "design"
    ].includes(w.toLowerCase()));

  return words.length
    ? words.slice(0, 2)
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : "Your Brand";
}

function makeCopy(prompt) {
  const p = prompt.toLowerCase();

  if (hasAny(p, ["plant", "nursery", "flower", "botanical"])) {
    return {
      type: "plant",
      kicker: "BRING NATURE INTO YOUR HOME",
      headline: "Make room for <span class='accent'>something green.</span>",
      sub: "Discover beautiful indoor plants, stylish pots, and simple plant-care tips for your home.",
      features: [
        ["♧", "Indoor plants", "Find leafy favorites for every room."],
        ["❀", "Beautiful pots", "Choose pots that complement your plants."],
        ["✦", "Easy plant care", "Learn simple tips to help your plants thrive."]
      ],
      about: "We make indoor gardening simple, joyful, and accessible to everyone."
    };
  }

  if (hasAny(p, ["coffee", "cafe", "café", "espresso"])) {
    return {
      type: "coffee",
      kicker: "CRAFTED SLOWLY. ENJOYED FULLY",
      headline: "A better kind of <span class='accent'>coffee break.</span>",
      sub: "Discover carefully crafted coffee, freshly prepared drinks, and a cozy place to relax.",
      features: [
        ["☕", "Coffee with care", "Enjoy freshly prepared coffee and quality beans."],
        ["✦", "A cozy space", "Relax in a warm and welcoming atmosphere."],
        ["♧", "Fresh every day", "Discover your next favorite drink."]
      ],
      about: "We bring people together through good coffee, friendly service, and thoughtful experiences."
    };
  }

  if (hasAny(p, ["portfolio", "developer", "programmer", "java"])) {
    return {
      type: "portfolio",
      kicker: "SOFTWARE DEVELOPER · PROBLEM SOLVER",
      headline: "Turning ideas into <span class='accent'>useful software.</span>",
      sub: "Explore my skills, projects, and the technologies I use to solve real-world problems.",
      features: [
        ["⌘", "Technical skills", "Java, data structures, and web development."],
        ["◇", "Featured projects", "Explore applications and solutions I have built."],
        ["↗", "Always learning", "Improving my skills through practice and projects."]
      ],
      about: "I enjoy solving problems, learning new technologies, and building practical software."
    };
  }

  if (hasAny(p, ["restaurant", "food", "bakery", "recipe"])) {
    return {
      type: "restaurant",
      kicker: "FRESH FLAVORS. MEMORABLE MOMENTS",
      headline: "Made fresh. Served with <span class='accent'>heart.</span>",
      sub: "Discover delicious food, fresh ingredients, and a welcoming place to gather.",
      features: [
        ["✧", "Our menu", "Explore delicious dishes prepared with care."],
        ["♡", "Quality ingredients", "Every meal is made with attention to detail."],
        ["⌖", "Visit us", "Find a place for your next meal."]
      ],
      about: "We bring people together through delicious food and welcoming hospitality."
    };
  }

  if (hasAny(p, ["fitness", "gym", "workout"])) {
    return {
      type: "fitness",
      kicker: "MOVE WITH PURPOSE",
      headline: "Stronger starts <span class='accent'>right here.</span>",
      sub: "Build strength, develop healthy habits, and make progress one session at a time.",
      features: [
        ["↗", "Personal training", "Work toward your goals with a clear plan."],
        ["◎", "Supportive community", "Stay motivated in a welcoming environment."],
        ["✦", "Track your progress", "Celebrate every milestone along the way."]
      ],
      about: "We help people build confidence and make fitness part of everyday life."
    };
  }

  if (hasAny(p, ["travel", "tour", "holiday", "vacation"])) {
    return {
      type: "travel",
      kicker: "YOUR NEXT ADVENTURE STARTS HERE",
      headline: "Find your next <span class='accent'>somewhere.</span>",
      sub: "Discover inspiring destinations, thoughtful itineraries, and memorable travel experiences.",
      features: [
        ["✈", "Explore destinations", "Find places that inspire your next trip."],
        ["◇", "Plan with ease", "Organize the details of your journey."],
        ["◎", "Memorable moments", "Make room for new experiences."]
      ],
      about: "We help curious travelers discover places and create experiences worth remembering."
    };
  }

  if (hasAny(p, ["fashion", "clothing", "boutique"])) {
    return {
      type: "fashion",
      kicker: "YOUR STYLE. YOUR STORY",
      headline: "Wear what makes you <span class='accent'>feel amazing.</span>",
      sub: "Discover thoughtfully selected styles for everyday confidence and special occasions.",
      features: [
        ["✦", "New arrivals", "Explore fresh styles and seasonal favorites."],
        ["◇", "Curated collections", "Find pieces that fit your personal style."],
        ["♡", "Made for you", "Make every outfit your own."]
      ],
      about: "We believe personal style should feel expressive, comfortable, and uniquely yours."
    };
  }

  if (hasAny(p, ["beauty", "salon", "skincare"])) {
    return {
      type: "beauty",
      kicker: "A MOMENT JUST FOR YOU",
      headline: "Your glow, your <span class='accent'>way.</span>",
      sub: "Discover beauty services and self-care experiences designed around your needs.",
      features: [
        ["✦", "Personalized care", "Explore services tailored to you."],
        ["♡", "Feel refreshed", "Make time for a little self-care."],
        ["◇", "Beauty essentials", "Find your next everyday favorite."]
      ],
      about: "Our goal is to make self-care feel welcoming, personal, and enjoyable."
    };
  }

  if (hasAny(p, ["education", "school", "course", "learning"])) {
    return {
      type: "education",
      kicker: "LEARN SOMETHING NEW",
      headline: "Your next chapter <span class='accent'>starts here.</span>",
      sub: "Explore learning resources and practical opportunities to build new skills.",
      features: [
        ["◇", "Learn at your pace", "Build knowledge step by step."],
        ["⌘", "Practical skills", "Connect learning with real-world projects."],
        ["↗", "Keep progressing", "Set goals and celebrate your progress."]
      ],
      about: "We make learning approachable, engaging, and focused on continuous growth."
    };
  }

  if (hasAny(p, ["ai", "startup", "saas", "software", "productivity"])) {
    return {
      type: "saas",
      kicker: "WORK SMARTER. BUILD FASTER",
      headline: "Make space for <span class='accent'>your next big idea.</span>",
      sub: "Discover a simpler way to organize work, collaborate, and turn ideas into action.",
      features: [
        ["✧", "Smart workflows", "Spend less time on repetitive tasks."],
        ["◇", "Everything organized", "Keep your work clear and accessible."],
        ["↗", "Built to scale", "Create room for your next stage of growth."]
      ],
      about: "We help teams simplify their workflows and focus on meaningful work."
    };
  }

  return {
    type: "general",
    kicker: "A BETTER WAY TO MOVE FORWARD",
    headline: "Make your next idea <span class='accent'>happen.</span>",
    sub: "A thoughtful digital experience designed around your goals and your audience.",
    features: [
      ["✧", "Made for your goals", "A focused experience built around your needs."],
      ["◈", "Simple by design", "Clear information and useful features."],
      ["↗", "Ready to grow", "A flexible foundation for your next big idea."]
    ],
    about: "We believe the best experiences make complicated things feel simple."
  };
}

function makePlantShop() {
  const products = [
    ["🪴", "Monstera Deliciosa", "A beautiful statement plant for your living space.", "799"],
    ["🌿", "Snake Plant", "A low-maintenance plant for busy plant lovers.", "499"],
    ["🌱", "Peace Lily", "Add a fresh, calming touch to your room.", "599"]
  ];

  return `
    <section class="site-about plant-shop" id="shop">
      <div class="site-kicker">OUR GREEN COLLECTION</div>
      <h2>Find your perfect plant.</h2>
      <p>Bring a little nature into every corner of your home.</p>
      <div class="site-features">
        ${products.map(([icon, name, description, price]) => `
          <article class="site-feature">
            <div class="site-feature-icon">${icon}</div>
            <h3>${name}</h3>
            <p>${description}</p>
            <h3>₹${price}</h3>
            <button class="site-button" data-shop="${name}">Shop Now</button>
          </article>
        `).join("")}
      </div>
    </section>`;
}

function renderSite() {
  const value = promptInput.value.trim();

  if (!value) {
    showToast("Add a short description first.");
    promptInput.focus();
    return;
  }

  if (value.length > 2000) {
    showToast("Please keep your prompt under 2000 characters.");
    return;
  }

  currentPrompt = value;

  const title = pickTitle(value);
  const copy = makeCopy(value);
  const themeClass = themeMap[currentTheme].cls;
  const hasPlantShop = copy.type === "plant";

  lastSiteTitle = title;

  canvas.innerHTML = `
    <div class="generated-site ${themeClass} layout-${currentLayout}" id="generatedSite">
      <nav class="site-nav">
        <div class="site-logo"><em>✳</em> ${cleanText(title)}</div>
        <div class="site-navlinks">
          <span role="button" tabindex="0" data-scroll="features">Features</span>
          ${hasPlantShop ? '<span role="button" tabindex="0" data-scroll="shop">Shop</span>' : ""}
          <span role="button" tabindex="0" data-scroll="about">About</span>
          <span role="button" tabindex="0" data-scroll="contact">Contact</span>
        </div>
        <button class="site-button secondary" data-scroll="contact">Let's talk ↗</button>
      </nav>

      <section class="site-hero">
        <div class="site-kicker">${copy.kicker}</div>
        <h1 id="siteHeadline">${copy.headline}</h1>
        <p>${copy.sub}</p>
        <div class="site-buttons">
          <button class="site-button" data-scroll="${hasPlantShop ? "shop" : "contact"}">${hasPlantShop ? "Explore plants" : "Get started"} ↗</button>
          <button class="site-button secondary" data-scroll="features">Explore more ↓</button>
        </div>
        <div class="site-proof">
          <span><b>01</b> Thoughtful design</span>
          <span><b>02</b> Built for people</span>
          <span><b>03</b> Ready to grow</span>
        </div>
      </section>

      <section class="site-features" id="features">
        ${copy.features.map(([icon, heading, description]) => `
          <article class="site-feature">
            <div class="site-feature-icon">${icon}</div>
            <div><h3>${heading}</h3><p>${description}</p></div>
          </article>
        `).join("")}
      </section>

      ${hasPlantShop ? makePlantShop() : ""}

      <section class="site-about" id="about">
        <div class="site-kicker">A LITTLE ABOUT US</div>
        <h2>Built around what matters.</h2>
        <p>${copy.about}</p>
      </section>

      <section class="site-contact" id="contact">
        <div>
          <h3>Ready to make it happen?</h3>
          <p>Let's start with a conversation.</p>
        </div>
        <button class="site-button" data-contact>Get in touch ↗</button>
      </section>

      <footer class="site-footer">
        <span>© ${new Date().getFullYear()} ${cleanText(title)}</span>
        <span>Made with intention ✳</span>
      </footer>
    </div>`;

  $("projectName").textContent = title;
  $("previewStatus").textContent = "Generated just now";
  $("sectionCount").textContent = hasPlantShop ? "6 sections" : "5 sections";

  generated = true;
  bindSiteActions();
  showToast("Your website concept is ready!");
}

function bindSiteActions() {
  canvas.querySelectorAll("[data-scroll]").forEach(el => {
    const goToSection = () => {
      const target = canvas.querySelector("#" + el.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    el.addEventListener("click", goToSection);
    el.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToSection();
      }
    });
  });

  canvas.querySelectorAll("[data-contact]").forEach(el => {
    el.addEventListener("click", () => {
      showToast("Demo action: contact section selected.");
    });
  });

  canvas.querySelectorAll("[data-shop]").forEach(el => {
    el.addEventListener("click", () => {
      showToast(`${el.dataset.shop} selected — demo only, no purchase made.`);
    });
  });
}

function setPrompt(prompt) {
  promptInput.value = prompt.slice(0, 2000);
  updateCount();
  renderSite();
}

function updateCount() {
  if (!$("charCount") || !promptInput) return;
  $("charCount").textContent = `${promptInput.value.length} / 2000`;
}

function checkWebsiteGoal() {
  if (!generated) {
    showToast("Generate a website first!");
    return;
  }

  const site = canvas.querySelector("#generatedSite");
  if (!site) return;

  const checks = [
    ["Main headline", !!site.querySelector("#siteHeadline")],
    ["Features section", !!site.querySelector("#features")],
    ["About section", !!site.querySelector("#about")],
    ["Contact section", !!site.querySelector("#contact")],
    ["Navigation", !!site.querySelector(".site-nav")],
    ["Mobile-friendly layout", !!site.querySelector(".site-hero")]
  ];

  const passed = checks.filter(([, ok]) => ok).length;

  $("goalResults").innerHTML = checks.map(([label, ok]) =>
    `<p>${ok ? "✅ Complete" : "⚠️ Missing"} — ${label}</p>`
  ).join("") +
  `<p><b>Structure check: ${passed}/${checks.length}</b></p>` +
  `<p>Tip: test the navigation and buttons in the preview before exporting.</p>`;
}

function buildExportHTML() {
  const site = canvas.querySelector("#generatedSite");
  if (!site) return "";

  const theme = themeMap[currentTheme];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cleanText(lastSiteTitle)}</title>
<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${theme.bg};color:#f8f7ff;font-family:Arial,sans-serif}
.generated-site{--site-accent:${theme.accent};background:${theme.bg};min-height:100vh}
.site-nav{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:20px 7%;border-bottom:1px solid #ffffff20}
.site-logo{font-weight:bold}.site-logo em{color:var(--site-accent)}
.site-navlinks{display:flex;gap:20px;font-size:13px}
.site-navlinks span,.site-nav-cta{cursor:pointer}
.site-button{background:var(--site-accent);color:#17172b;border:0;border-radius:7px;padding:12px 17px;font-weight:bold;cursor:pointer}
.site-button:hover{filter:brightness(1.1);transform:translateY(-1px)}
.site-button.secondary{background:transparent;border:1px solid #ffffff44;color:white}
.site-hero{padding:80px 9% 55px}
.site-kicker{font-size:11px;letter-spacing:1.5px;color:var(--site-accent);font-weight:bold}
.site-hero h1{font-size:clamp(40px,6vw,72px);line-height:1.1;max-width:800px}
.accent{color:var(--site-accent)}
.site-hero p,.site-feature p,.site-about p,.site-contact p{color:#b8b6cc;line-height:1.8}
.site-buttons{display:flex;flex-wrap:wrap;gap:12px;margin-top:25px}
.site-proof{display:flex;flex-wrap:wrap;gap:25px;margin-top:30px;color:#aaa8c1;font-size:12px}
.site-proof b{display:block;color:white;font-size:16px}
.site-features{padding:0 7% 55px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}
.site-feature{border:1px solid #ffffff20;background:#ffffff08;border-radius:10px;padding:22px;min-width:0}
.site-feature-icon{color:var(--site-accent);font-size:22px}
.site-about{padding:35px 8% 55px;border-top:1px solid #ffffff18}
.site-about h2,.site-contact h3{font-size:28px}
.plant-shop .site-features{padding:20px 0 0}
.site-contact{padding:30px 8%;background:#ffffff08;display:flex;justify-content:space-between;align-items:center;gap:20px}
.site-footer{padding:20px 8%;font-size:12px;color:#85839e;display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}
.layout-minimal .site-hero{padding-top:55px;padding-bottom:35px}
.layout-minimal .site-feature{background:transparent}
.layout-bold .site-hero h1{font-size:clamp(48px,8vw,90px);max-width:1000px}
.layout-bold .site-feature{border-radius:18px}
@media(max-width:650px){
 .site-nav{flex-wrap:wrap}.site-navlinks{gap:12px;flex-wrap:wrap}
 .site-hero{padding:45px 7%}.site-features{grid-template-columns:1fr;padding-left:7%;padding-right:7%}
 .site-proof{gap:15px}.site-contact{align-items:flex-start;flex-direction:column}
 .site-hero h1{font-size:42px}
}
</style>
</head>
<body>${site.outerHTML}
<script>
document.querySelectorAll('[data-scroll]').forEach(el=>el.addEventListener('click',()=>{
 const target=document.getElementById(el.dataset.scroll);
 if(target)target.scrollIntoView({behavior:'smooth',block:'center'});
}));
document.querySelectorAll('[data-contact]').forEach(el=>el.addEventListener('click',()=>{
 alert('Thanks for your interest! This is a demo contact action.');
}));
document.querySelectorAll('[data-shop]').forEach(el=>el.addEventListener('click',()=>{
 alert(el.dataset.shop+' selected. This demo does not process purchases.');
}));
<\/script>
</body>
</html>`;
}

function exportHTML() {
  if (!generated) {
    showToast("Generate a website before exporting.");
    return;
  }

  const html = buildExportHTML();
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${lastSiteTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Standalone HTML exported successfully!");
}

function resetWorkspace() {
  promptInput.value = "";
  updateCount();

  currentPrompt = "";
  generated = false;

  canvas.classList.remove("mobile");
  canvas.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">✳</div>
      <h3>Your next idea starts here.</h3>
      <p>Enter a prompt and generate your first website preview.</p>
      <div class="empty-skeleton"><span></span><span></span><span></span></div>
    </div>`;

  $("projectName").textContent = "New website";
  $("previewStatus").textContent = "Waiting for your idea";
  $("sectionCount").textContent = "0 sections";

  if ($("goalResults")) {
    $("goalResults").textContent = "Generate a website to check its sections.";
  }

  showToast("Workspace reset.");
}

// GENERATE AND REGENERATE
$("generateBtn").addEventListener("click", renderSite);
$("regenerateBtn").addEventListener("click", renderSite);

promptInput.addEventListener("input", updateCount);

promptInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    renderSite();
  }
});

// EXAMPLE PROMPTS
document.querySelectorAll("[data-prompt]").forEach(btn => {
  btn.addEventListener("click", () => setPrompt(btn.dataset.prompt));
});

// THEMES
document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTheme = btn.dataset.theme;

    document.querySelectorAll(".theme-option").forEach(b => {
      b.classList.toggle("selected", b === btn);
    });

    if (generated) renderSite();
    else showToast("Theme selected. Generate a website to preview it.");
  });
});

// LAYOUT
$("layoutSelect").addEventListener("change", event => {
  currentLayout = event.target.value;
  if (generated) renderSite();
});

// DESKTOP / MOBILE PREVIEW
document.querySelectorAll(".device-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".device-btn").forEach(b => {
      b.classList.toggle("active", b === btn);
    });

    canvas.classList.toggle("mobile", btn.dataset.device === "mobile");

    showToast(btn.dataset.device === "mobile"
      ? "Mobile preview enabled."
      : "Desktop preview enabled.");
  });
});

// EXPORT AND GOAL CHECKER
$("exportTopBtn").addEventListener("click", exportHTML);
$("checkGoalBtn").addEventListener("click", checkWebsiteGoal);

// RESET AND NEW PROJECT
$("resetBtn").addEventListener("click", resetWorkspace);
$("newProjectBtn").addEventListener("click", resetWorkspace);

// EXAMPLE PROMPTS SHORTCUT
$("examplesBtn").addEventListener("click", () => {
  document.querySelector(".prompt-chips").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  showToast("Choose an example prompt to get started.");
});

// OPEN A STANDALONE PREVIEW

 // OPEN GENERATED WEBSITE IN A NEW TAB
$("openPreviewBtn").addEventListener("click", () => {
  if (!generated) {
    showToast("Generate a website before opening preview.");
    return;
  }

  const html = buildExportHTML();

  // Open the tab directly from the user's click.
  const newTab = window.open("about:blank", "_blank");

  if (!newTab) {
    showToast("Pop-ups are blocked. Allow pop-ups and try again.");
    return;
  }

  newTab.document.open();
  newTab.document.write(html);
  newTab.document.close();

  newTab.document.title = lastSiteTitle;
});


// EDIT HEADLINE
$("editHeadlineBtn").addEventListener("click", () => {
  if (!generated) {
    showToast("Generate a website before editing.");
    return;
  }

  const headline = window.prompt(
    "Enter a new website headline:",
    canvas.querySelector("#siteHeadline").textContent
  );

  if (headline === null || !headline.trim()) return;

  canvas.querySelector("#siteHeadline").textContent = headline.trim();
  showToast("Headline updated. Export to keep your change.");
});

// INITIALIZE
promptInput.maxLength = 2000;
updateCount();
