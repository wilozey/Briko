const SERVICES = ["Plumbing", "Electrical", "Air conditioning", "Cleaning", "Carpentry", "Mechanics"];
const COMMUNES = ["Cocody", "Marcory", "Yopougon", "Plateau", "Abobo", "Treichville"];
const STATUSES = ["New", "Contacted", "Quoted", "Scheduled", "In progress", "Done", "Dispute"];
const STORAGE_KEY = "briko-service-os-v1";

const seedState = {
  artisans: [
    {
      id: "art-1",
      name: "Koffi N'Guessan",
      service: "Plumbing",
      commune: "Cocody",
      rating: 4.8,
      jobsDone: 132,
      verification: "Certified",
      response: "12m",
      notes: "Leak repair, bathroom installs, water heaters, emergency callouts",
      active: true
    },
    {
      id: "art-2",
      name: "Awa Traore",
      service: "Electrical",
      commune: "Marcory",
      rating: 4.9,
      jobsDone: 96,
      verification: "Certified",
      response: "18m",
      notes: "Panels, sockets, lighting, appliance safety, office maintenance",
      active: true
    },
    {
      id: "art-3",
      name: "Moussa Coulibaly",
      service: "Air conditioning",
      commune: "Yopougon",
      rating: 4.7,
      jobsDone: 74,
      verification: "Verified",
      response: "25m",
      notes: "AC cleaning, gas refill, diagnosis, routine maintenance",
      active: true
    },
    {
      id: "art-4",
      name: "Nadia Konan",
      service: "Cleaning",
      commune: "Plateau",
      rating: 4.6,
      jobsDone: 58,
      verification: "Verified",
      response: "35m",
      notes: "Move-out cleaning, offices, post-renovation jobs",
      active: true
    },
    {
      id: "art-5",
      name: "Jean-Baptiste Seri",
      service: "Carpentry",
      commune: "Cocody",
      rating: 4.8,
      jobsDone: 81,
      verification: "Certified",
      response: "28m",
      notes: "Doors, wardrobes, kitchen repairs, custom shelving",
      active: true
    },
    {
      id: "art-6",
      name: "Fatou Bamba",
      service: "Electrical",
      commune: "Yopougon",
      rating: 4.5,
      jobsDone: 43,
      verification: "Imported",
      response: "42m",
      notes: "Small repairs, lighting, appliance checks. Needs ID verification.",
      active: true
    }
  ],
  jobs: [
    {
      id: "BK-1042",
      customer: "Aminata K.",
      phone: "+225 0700000001",
      service: "Plumbing",
      commune: "Cocody",
      urgency: "Today",
      budget: "25,000-75,000 FCFA",
      problem: "Kitchen pipe leaking under the sink.",
      status: "New",
      artisanId: "art-1",
      createdAt: "2026-04-26T06:20:00.000Z",
      note: "Call customer before sending artisan."
    },
    {
      id: "BK-1041",
      customer: "Residence Plateau",
      phone: "+225 0700000002",
      service: "Air conditioning",
      commune: "Plateau",
      urgency: "This week",
      budget: "75,000+ FCFA",
      problem: "Office AC not cooling in meeting room.",
      status: "New",
      artisanId: "",
      createdAt: "2026-04-26T06:05:00.000Z",
      note: "No strong AC supply in Plateau yet."
    },
    {
      id: "BK-1039",
      customer: "Kone M.",
      phone: "+225 0700000003",
      service: "Electrical",
      commune: "Marcory",
      urgency: "Emergency",
      budget: "Unknown",
      problem: "Breaker trips every night.",
      status: "Contacted",
      artisanId: "art-2",
      createdAt: "2026-04-25T19:40:00.000Z",
      note: "Awa accepted. Waiting for quote."
    },
    {
      id: "BK-1036",
      customer: "Hotel Cocody",
      phone: "+225 0700000004",
      service: "Carpentry",
      commune: "Cocody",
      urgency: "This week",
      budget: "25,000-75,000 FCFA",
      problem: "Bedroom wardrobe doors need repair.",
      status: "Quoted",
      artisanId: "art-5",
      createdAt: "2026-04-25T15:30:00.000Z",
      note: "Quote sent: 45,000 FCFA."
    },
    {
      id: "BK-1034",
      customer: "Nadia S.",
      phone: "+225 0700000005",
      service: "Cleaning",
      commune: "Plateau",
      urgency: "Today",
      budget: "Under 25,000 FCFA",
      problem: "Post-renovation cleaning for small office.",
      status: "Scheduled",
      artisanId: "art-4",
      createdAt: "2026-04-25T10:20:00.000Z",
      note: "Scheduled for 16:00."
    },
    {
      id: "BK-1031",
      customer: "Yao Family",
      phone: "+225 0700000006",
      service: "Plumbing",
      commune: "Yopougon",
      urgency: "Today",
      budget: "Unknown",
      problem: "Water heater issue.",
      status: "Dispute",
      artisanId: "",
      createdAt: "2026-04-24T08:10:00.000Z",
      note: "Customer says issue returned after repair."
    }
  ],
  sequence: 1043
};

const names = [
  ["Briko", "Best current option. Short, memorable, and broad enough for home services."],
  ["MainPro", "Clearer in French. Good if the brand should feel more formal and professional."],
  ["FixiCI", "Modern and repair-led. Strong for fast jobs, weaker for premium services."],
  ["ProxiMains", "Warm and trust-led. More human, but less direct than Briko."]
];

const roadmap = [
  ["Now", "Request intake, job cards, artisan CRUD, dispatch statuses, and human fallback."],
  ["Next", "CSV import, duplicate detection, verification documents, and audit logs."],
  ["Then", "Customer accounts, job detail pages, verified reviews, and dispute resolution."],
  ["Later", "Mobile money escrow, artisan subscriptions, AI diagnosis, and Android app."]
];

const promises = [
  ["Instant estimates", "Use estimated ranges until real quote history is collected."],
  ["Available now", "Show only after recent artisan availability confirmation."],
  ["Guaranteed work", "Attach to completed Briko jobs with dispute tracking."],
  ["Verified reviews", "Require job completion before review submission."],
  ["Payments", "Add mobile money after job tracking and completion proof are stable."]
];

let state = structuredClone(seedState);
let apiMode = false;

const els = {
  viewTitle: document.querySelector("#viewTitle"),
  metricsGrid: document.querySelector("#metricsGrid"),
  attentionList: document.querySelector("#attentionList"),
  gapList: document.querySelector("#gapList"),
  matchPreview: document.querySelector("#matchPreview"),
  pipeline: document.querySelector("#pipeline"),
  artisanGrid: document.querySelector("#artisanGrid"),
  trustQueue: document.querySelector("#trustQueue"),
  promiseChecklist: document.querySelector("#promiseChecklist"),
  funnel: document.querySelector("#funnel"),
  coverageBars: document.querySelector("#coverageBars"),
  nameList: document.querySelector("#nameList"),
  roadmap: document.querySelector("#roadmap"),
  toast: document.querySelector("#toast"),
  jobDialog: document.querySelector("#jobDialog"),
  jobEditForm: document.querySelector("#jobEditForm")
};

function loadLocalState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(seedState);
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (apiMode) {
    fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    }).catch(() => {
      apiMode = false;
      showToast("Server save failed. Continuing in browser storage.");
    });
  }
}

function normalizeState() {
  state.jobs.forEach((job) => {
    job.quote ||= "";
    job.scheduledAt ||= "";
    job.completionProof ||= "";
    job.timeline ||= [
      {
        at: job.createdAt || new Date().toISOString(),
        label: "Job created",
        detail: job.note || "Initial request captured."
      }
    ];
  });
}

async function loadServerState() {
  if (location.protocol === "file:") {
    state = loadLocalState();
    normalizeState();
    return;
  }

  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) throw new Error("State API unavailable");
    const data = await response.json();
    apiMode = true;

    if (!Array.isArray(data.jobs) || !Array.isArray(data.artisans) || data.jobs.length === 0) {
      state = structuredClone(seedState);
      saveState();
      return;
    }

    state = {
      artisans: data.artisans,
      jobs: data.jobs,
      sequence: data.sequence || seedState.sequence
    };
  } catch {
    state = loadLocalState();
    apiMode = false;
  }
  normalizeState();
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function byId(id) {
  return state.artisans.find((artisan) => artisan.id === id);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewName);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  const titles = {
    command: "Command center",
    public: "Public booking",
    intake: "Customer intake",
    dispatch: "Dispatch board",
    artisans: "Artisan management",
    trust: "Trust operations",
    analytics: "Analytics",
    strategy: "Strategy"
  };
  els.viewTitle.textContent = titles[viewName] || "Briko";
}

function fillSelect(select, values, options = {}) {
  const { allLabel, selected = "" } = options;
  const rows = allLabel ? [`<option value="all">${allLabel}</option>`] : [];
  rows.push(...values.map((value) => `<option value="${value}">${value}</option>`));
  select.innerHTML = rows.join("");
  if (selected) select.value = selected;
}

function setupSelects() {
  fillSelect(document.querySelector("#requestService"), SERVICES);
  fillSelect(document.querySelector("#requestCommune"), COMMUNES);
  fillSelect(document.querySelector("#publicService"), SERVICES);
  fillSelect(document.querySelector("#publicCommune"), COMMUNES);
  fillSelect(document.querySelector("#artisanService"), SERVICES);
  fillSelect(document.querySelector("#artisanCommune"), COMMUNES);
  fillSelect(document.querySelector("#artisanServiceFilter"), SERVICES, { allLabel: "All services" });
  fillSelect(document.querySelector("#artisanCommuneFilter"), COMMUNES, { allLabel: "All communes" });
  fillSelect(document.querySelector("#jobServiceFilter"), SERVICES, { allLabel: "All services" });
  fillSelect(document.querySelector("#jobStatusFilter"), STATUSES, { allLabel: "All statuses" });
  fillSelect(document.querySelector("#editStatus"), STATUSES);
}

function getFilteredJobs() {
  const service = document.querySelector("#jobServiceFilter").value;
  const status = document.querySelector("#jobStatusFilter").value;
  const query = document.querySelector("#globalSearch").value.trim().toLowerCase();
  return state.jobs.filter((job) => {
    const artisan = byId(job.artisanId);
    const haystack = [job.id, job.customer, job.service, job.commune, job.problem, job.status, artisan?.name || ""].join(" ").toLowerCase();
    return (service === "all" || job.service === service) && (status === "all" || job.status === status) && (!query || haystack.includes(query));
  });
}

function getFilteredArtisans() {
  const service = document.querySelector("#artisanServiceFilter").value;
  const commune = document.querySelector("#artisanCommuneFilter").value;
  const query = document.querySelector("#globalSearch").value.trim().toLowerCase();
  return state.artisans.filter((artisan) => {
    const haystack = [artisan.name, artisan.service, artisan.commune, artisan.verification, artisan.notes].join(" ").toLowerCase();
    return (service === "all" || artisan.service === service) && (commune === "all" || artisan.commune === commune) && (!query || haystack.includes(query));
  });
}

function suggestedArtisans(service, commune) {
  return state.artisans
    .filter((artisan) => artisan.active && artisan.verification !== "Suspended")
    .map((artisan) => {
      let score = 0;
      if (artisan.service === service) score += 45;
      if (artisan.commune === commune) score += 25;
      if (artisan.verification === "Certified") score += 15;
      if (artisan.verification === "Verified") score += 10;
      score += Math.round((artisan.rating || 4) * 2);
      return { artisan, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function renderMetrics() {
  const open = state.jobs.filter((job) => !["Done"].includes(job.status)).length;
  const matched = state.jobs.filter((job) => job.artisanId).length;
  const verified = state.artisans.filter((artisan) => ["Verified", "Certified"].includes(artisan.verification)).length;
  const disputes = state.jobs.filter((job) => job.status === "Dispute").length;
  const matchRate = state.jobs.length ? Math.round((matched / state.jobs.length) * 100) : 0;

  const metrics = [
    ["Open jobs", open, "Work still moving through the board", ""],
    ["Verified supply", verified, "Artisans allowed into matching", "good"],
    ["Match rate", `${matchRate}%`, "Jobs with an assigned artisan", matchRate < 70 ? "warning" : "good"],
    ["Storage", apiMode ? "Server" : "Browser", apiMode ? "Saved through local backend" : "Open via localhost for backend mode", apiMode ? "good" : "warning"]
  ];

  els.metricsGrid.innerHTML = metrics.map(([label, value, detail, tone]) => `
    <article class="metric ${tone}">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${detail}</small>
    </article>
  `).join("");
}

function renderAttention() {
  const jobs = state.jobs
    .filter((job) => ["New", "Dispute"].includes(job.status) || !job.artisanId)
    .slice(0, 6);

  els.attentionList.innerHTML = jobs.map((job) => {
    const artisan = byId(job.artisanId);
    return `
      <article class="attention-card">
        <div class="meta-line">
          <span class="tag">${job.id}</span>
          <span class="tag blue">${job.service}</span>
          <span class="tag ${job.status === "Dispute" ? "danger" : "gold"}">${job.status}</span>
        </div>
        <strong>${job.customer}: ${job.problem}</strong>
        <p>${job.commune} - ${artisan ? `Assigned to ${artisan.name}` : "Needs manual assignment"}</p>
        <div class="card-actions">
          <button class="small-btn primary" data-edit-job="${job.id}">Update</button>
          <button class="small-btn" data-view="dispatch">Board</button>
        </div>
      </article>
    `;
  }).join("") || `<article class="attention-card"><strong>Nothing urgent</strong><p>The board is clear enough to focus on supply growth.</p></article>`;
}

function renderGaps() {
  const rows = SERVICES.map((service) => {
    const count = state.artisans.filter((artisan) => artisan.service === service && artisan.active && artisan.verification !== "Suspended").length;
    return { service, count };
  }).sort((a, b) => a.count - b.count);

  els.gapList.innerHTML = rows.map(({ service, count }) => {
    const tone = count < 1 ? "danger" : count < 2 ? "gold" : "";
    const label = count < 1 ? "No supply" : count < 2 ? "Thin supply" : "Covered";
    return `
      <article class="gap-card">
        <div class="meta-line">
          <span class="tag ${tone === "danger" ? "danger" : tone === "gold" ? "gold" : ""}">${label}</span>
          <span class="tag blue">${count} artisans</span>
        </div>
        <strong>${service}</strong>
        <p>${count < 2 ? "Recruit before making this category prominent." : "Safe enough for public routing."}</p>
      </article>
    `;
  }).join("");
}

function renderMatches(service = "Plumbing", commune = "Cocody") {
  const matches = suggestedArtisans(service, commune);
  els.matchPreview.innerHTML = matches.map(({ artisan, score }) => `
    <article class="match-card">
      <div class="meta-line">
        <span class="tag">${score} match</span>
        <span class="tag blue">${artisan.service}</span>
        <span class="tag gold">${artisan.rating}/5</span>
      </div>
      <strong>${artisan.name}</strong>
      <p>${artisan.commune} - ${artisan.notes}</p>
    </article>
  `).join("");
}

function renderPipeline() {
  const jobs = getFilteredJobs();
  els.pipeline.innerHTML = STATUSES.map((status) => {
    const stageJobs = jobs.filter((job) => job.status === status);
    return `
      <div class="stage">
        <h3>${status}<span>${stageJobs.length}</span></h3>
        ${stageJobs.map(renderJobCard).join("")}
      </div>
    `;
  }).join("");
}

function renderJobCard(job) {
  const artisan = byId(job.artisanId);
  return `
    <article class="job-card">
      <div class="meta-line">
        <span class="tag">${job.id}</span>
        <span class="tag blue">${job.commune}</span>
        <span class="tag ${job.urgency === "Emergency" ? "danger" : "gold"}">${job.urgency}</span>
      </div>
      <strong>${job.customer}</strong>
      <small>${job.service} - ${job.problem}</small>
      <small>${artisan ? `Assigned: ${artisan.name}` : "No artisan assigned"}</small>
      ${job.quote ? `<small>Quote: ${job.quote}</small>` : ""}
      ${job.scheduledAt ? `<small>Scheduled: ${formatDateTime(job.scheduledAt)}</small>` : ""}
      <div class="card-actions">
        <button class="small-btn primary" data-edit-job="${job.id}">Update</button>
        <button class="small-btn" data-next-status="${job.id}">Next</button>
      </div>
    </article>
  `;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function addTimeline(job, label, detail) {
  job.timeline ||= [];
  job.timeline.unshift({
    at: new Date().toISOString(),
    label,
    detail
  });
}

function renderArtisans() {
  const artisans = getFilteredArtisans();
  els.artisanGrid.innerHTML = artisans.map((artisan) => `
    <article class="artisan-card">
      <div class="artisan-top">
        <div class="artisan-photo">${initials(artisan.name)}</div>
        <div>
          <strong>${artisan.name}</strong>
          <div class="meta-line">
            <span class="tag">${artisan.service}</span>
            <span class="tag blue">${artisan.commune}</span>
          </div>
        </div>
      </div>
      <p>${artisan.notes}</p>
      <div class="meta-line">
        <span class="tag gold">${artisan.rating}/5</span>
        <span class="tag">${artisan.jobsDone} jobs</span>
        <span class="tag ${["Imported", "Suspended"].includes(artisan.verification) ? "danger" : ""}">${artisan.verification}</span>
        <span class="tag blue">${artisan.response}</span>
      </div>
      <div class="card-actions">
        <button class="small-btn primary" data-verify-artisan="${artisan.id}">${artisan.verification === "Certified" ? "Verified" : "Certify"}</button>
        <button class="small-btn danger" data-toggle-artisan="${artisan.id}">${artisan.active ? "Deactivate" : "Activate"}</button>
      </div>
    </article>
  `).join("") || `<article class="artisan-card"><strong>No artisan found</strong><p>Add supply or widen the filters before promoting this category.</p></article>`;
}

function renderTrust() {
  const imported = state.artisans.filter((artisan) => artisan.verification === "Imported");
  const disputes = state.jobs.filter((job) => job.status === "Dispute");
  const unassigned = state.jobs.filter((job) => !job.artisanId && job.status !== "Done");

  const items = [
    ...imported.map((artisan) => ({
      title: `${artisan.name} needs verification`,
      detail: `${artisan.service} in ${artisan.commune}. Confirm ID, phone, references, and service zone.`,
      tone: "danger"
    })),
    ...disputes.map((job) => ({
      title: `${job.id} dispute open`,
      detail: `${job.customer}: ${job.problem}`,
      tone: "danger"
    })),
    ...unassigned.map((job) => ({
      title: `${job.id} has no artisan`,
      detail: `${job.service} in ${job.commune}. Use manual callback if no good match exists.`,
      tone: "gold"
    }))
  ];

  els.trustQueue.innerHTML = items.map((item) => `
    <article class="queue-card">
      <div class="meta-line"><span class="tag ${item.tone === "danger" ? "danger" : "gold"}">${item.tone === "danger" ? "Review" : "Watch"}</span></div>
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </article>
  `).join("") || `<article class="queue-card"><strong>Trust queue clear</strong><p>Verification, assignment, and dispute issues are under control.</p></article>`;

  els.promiseChecklist.innerHTML = promises.map(([title, detail]) => `
    <article class="check-item">
      <strong>${title}</strong>
      <p>${detail}</p>
    </article>
  `).join("");
}

function renderAnalytics() {
  const total = Math.max(state.jobs.length, 1);
  const contacted = state.jobs.filter((job) => STATUSES.indexOf(job.status) >= STATUSES.indexOf("Contacted")).length;
  const quoted = state.jobs.filter((job) => STATUSES.indexOf(job.status) >= STATUSES.indexOf("Quoted")).length;
  const scheduled = state.jobs.filter((job) => STATUSES.indexOf(job.status) >= STATUSES.indexOf("Scheduled")).length;
  const done = state.jobs.filter((job) => job.status === "Done").length;
  const funnel = [
    ["Requests", state.jobs.length, 100],
    ["Contacted", contacted, Math.round((contacted / total) * 100)],
    ["Quoted", quoted, Math.round((quoted / total) * 100)],
    ["Scheduled", scheduled, Math.round((scheduled / total) * 100)],
    ["Done", done, Math.round((done / total) * 100)]
  ];

  els.funnel.innerHTML = funnel.map(([label, count, percent]) => `
    <article class="funnel-row">
      <div class="meta-line">
        <strong>${label}</strong>
        <span class="tag blue">${count}</span>
        <span class="tag">${percent}%</span>
      </div>
      <div class="bar"><span style="width:${percent}%"></span></div>
    </article>
  `).join("");

  els.coverageBars.innerHTML = SERVICES.map((service) => {
    const count = state.artisans.filter((artisan) => artisan.service === service && artisan.active && artisan.verification !== "Suspended").length;
    const percent = Math.min(100, count * 25);
    const tone = count < 1 ? "danger" : count < 3 ? "warning" : "";
    return `
      <article class="coverage-row ${tone}">
        <div class="meta-line">
          <strong>${service}</strong>
          <span class="tag ${tone === "danger" ? "danger" : tone === "warning" ? "gold" : ""}">${count} active</span>
        </div>
        <div class="bar"><span style="width:${percent}%"></span></div>
      </article>
    `;
  }).join("");
}

function renderStrategy() {
  els.nameList.innerHTML = names.map(([name, detail]) => `
    <article class="name-card">
      <strong>${name}</strong>
      <p>${detail}</p>
    </article>
  `).join("");

  els.roadmap.innerHTML = roadmap.map(([period, detail]) => `
    <article class="roadmap-item">
      <div class="meta-line"><span class="tag blue">${period}</span></div>
      <p>${detail}</p>
    </article>
  `).join("");
}

function renderAll() {
  renderMetrics();
  renderAttention();
  renderGaps();
  renderMatches();
  renderPipeline();
  renderArtisans();
  renderTrust();
  renderAnalytics();
  renderStrategy();
}

function openJob(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;
  const artisanOptions = [`<option value="">Manual assignment needed</option>`]
    .concat(state.artisans
      .filter((artisan) => artisan.active && artisan.verification !== "Suspended")
      .map((artisan) => `<option value="${artisan.id}">${artisan.name} - ${artisan.service}, ${artisan.commune}</option>`));
  document.querySelector("#editArtisan").innerHTML = artisanOptions.join("");
  els.jobEditForm.elements.id.value = job.id;
  els.jobEditForm.elements.status.value = job.status;
  els.jobEditForm.elements.artisanId.value = job.artisanId;
  els.jobEditForm.elements.quote.value = job.quote || "";
  els.jobEditForm.elements.scheduledAt.value = toDateTimeLocal(job.scheduledAt);
  els.jobEditForm.elements.completionProof.value = job.completionProof || "";
  els.jobEditForm.elements.note.value = job.note || "";
  document.querySelector("#jobTimeline").innerHTML = (job.timeline || []).map((item) => `
    <article class="timeline-item">
      <strong>${item.label}</strong>
      <span>${formatDateTime(item.at)} - ${item.detail}</span>
    </article>
  `).join("") || `<article class="timeline-item"><strong>No timeline yet</strong><span>Save the job to start tracking changes.</span></article>`;
  document.querySelector("#modalJobTitle").textContent = `${job.id} - ${job.customer}`;
  els.jobDialog.showModal();
}

function nextStatus(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;
  const index = STATUSES.indexOf(job.status);
  const previous = job.status;
  job.status = STATUSES[Math.min(STATUSES.length - 1, index + 1)];
  if (job.status !== previous) addTimeline(job, "Status changed", `${previous} -> ${job.status}`);
  saveState();
  renderAll();
  showToast(`${job.id} moved to ${job.status}`);
}

function createJob(form) {
  const data = Object.fromEntries(new FormData(form));
  const matches = suggestedArtisans(data.service, data.commune);
  const best = matches[0]?.score >= 65 ? matches[0].artisan.id : "";
  const job = {
    id: `BK-${state.sequence++}`,
    customer: data.customer,
    phone: data.phone,
    service: data.service,
    commune: data.commune,
    urgency: data.urgency,
    budget: data.budget,
    problem: data.problem,
    status: "New",
    artisanId: best,
    createdAt: new Date().toISOString(),
    quote: "",
    scheduledAt: "",
    completionProof: "",
    note: best ? "Auto-shortlisted from current supply." : "Manual callback needed.",
    timeline: [
      {
        at: new Date().toISOString(),
        label: "Job created",
        detail: best ? "Auto-shortlisted from current supply." : "Manual callback needed."
      }
    ]
  };
  state.jobs.unshift(job);
  saveState();
  form.reset();
  renderAll();
  if (form.id === "publicRequestForm") {
    const artisan = byId(best);
    document.querySelector("#publicResult").innerHTML = `
      <article class="match-card">
        <div class="meta-line">
          <span class="tag">${job.id}</span>
          <span class="tag ${best ? "" : "gold"}">${best ? "Match suggested" : "Manual callback"}</span>
        </div>
        <strong>${best ? `We shortlisted ${artisan.name}` : "Briko will manually review this request"}</strong>
        <p>${best ? `${artisan.service} in ${artisan.commune}. Our operator still confirms before dispatch.` : "No strong instant match was found, so this goes to the internal dispatch board."}</p>
      </article>
    `;
  } else {
    setView("dispatch");
  }
  showToast(`${job.id} created${best ? " with a suggested match" : " for manual review"}`);
}

function addArtisan(form) {
  const data = Object.fromEntries(new FormData(form));
  state.artisans.unshift({
    id: `art-${Date.now()}`,
    name: data.name,
    service: data.service,
    commune: data.commune,
    rating: 4.5,
    jobsDone: 0,
    verification: data.verification,
    response: data.response || "30m",
    notes: data.notes,
    active: true
  });
  saveState();
  form.reset();
  renderAll();
  showToast("Artisan added to the directory");
}

function importArtisans() {
  const input = document.querySelector("#artisanCsv");
  const rows = input.value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  let imported = 0;
  rows.forEach((row) => {
    const [name, service, commune, verification = "Imported", response = "30m", ...notes] = row.split(",").map((cell) => cell.trim());
    if (!name || !SERVICES.includes(service) || !COMMUNES.includes(commune)) return;
    state.artisans.unshift({
      id: `art-${Date.now()}-${imported}`,
      name,
      service,
      commune,
      rating: 4.5,
      jobsDone: 0,
      verification,
      response,
      notes: notes.join(", ") || "Imported from CSV. Needs verification notes.",
      active: true
    });
    imported += 1;
  });

  if (!imported) {
    showToast("No valid rows imported. Use name,service,commune,verification,response,notes");
    return;
  }

  input.value = "";
  saveState();
  renderAll();
  showToast(`${imported} artisans imported`);
}

function toggleArtisan(id) {
  const artisan = byId(id);
  if (!artisan) return;
  artisan.active = !artisan.active;
  saveState();
  renderAll();
  showToast(`${artisan.name} ${artisan.active ? "activated" : "deactivated"}`);
}

function verifyArtisan(id) {
  const artisan = byId(id);
  if (!artisan) return;
  artisan.verification = artisan.verification === "Certified" ? "Verified" : "Certified";
  saveState();
  renderAll();
  showToast(`${artisan.name} marked ${artisan.verification}`);
}

function exportData() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "briko-service-os-export.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Export downloaded");
}

function resetDemo() {
  state = structuredClone(seedState);
  normalizeState();
  saveState();
  setupSelects();
  renderAll();
  showToast("Demo data reset");
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-action='open-request']").forEach((button) => {
  button.addEventListener("click", () => setView("intake"));
});

document.querySelector("[data-action='export-data']").addEventListener("click", exportData);
document.querySelector("[data-action='reset-demo']").addEventListener("click", resetDemo);

document.querySelector("#requestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  createJob(event.currentTarget);
});

document.querySelector("#publicRequestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  createJob(event.currentTarget);
});

document.querySelector("#artisanForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addArtisan(event.currentTarget);
});

document.querySelector("#requestService").addEventListener("change", () => {
  renderMatches(document.querySelector("#requestService").value, document.querySelector("#requestCommune").value);
});

document.querySelector("#requestCommune").addEventListener("change", () => {
  renderMatches(document.querySelector("#requestService").value, document.querySelector("#requestCommune").value);
});

document.querySelector("#publicService").addEventListener("change", () => {
  renderMatches(document.querySelector("#publicService").value, document.querySelector("#publicCommune").value);
});

document.querySelector("#publicCommune").addEventListener("change", () => {
  renderMatches(document.querySelector("#publicService").value, document.querySelector("#publicCommune").value);
});

["#jobServiceFilter", "#jobStatusFilter", "#artisanServiceFilter", "#artisanCommuneFilter"].forEach((selector) => {
  document.querySelector(selector).addEventListener("change", renderAll);
});

document.querySelector("#globalSearch").addEventListener("input", renderAll);

document.body.addEventListener("click", (event) => {
  const editJob = event.target.closest("[data-edit-job]");
  const next = event.target.closest("[data-next-status]");
  const toggle = event.target.closest("[data-toggle-artisan]");
  const verify = event.target.closest("[data-verify-artisan]");
  const close = event.target.closest("[data-action='close-modal']");
  const importButton = event.target.closest("[data-action='import-artisans']");

  if (editJob) openJob(editJob.dataset.editJob);
  if (next) nextStatus(next.dataset.nextStatus);
  if (toggle) toggleArtisan(toggle.dataset.toggleArtisan);
  if (verify) verifyArtisan(verify.dataset.verifyArtisan);
  if (close) els.jobDialog.close();
  if (importButton) importArtisans();
});

els.jobEditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const job = state.jobs.find((item) => item.id === data.id);
  if (job) {
    const changes = [];
    if (job.status !== data.status) changes.push(`status ${job.status} -> ${data.status}`);
    if (job.artisanId !== data.artisanId) {
      const nextArtisan = byId(data.artisanId);
      changes.push(`artisan ${nextArtisan ? nextArtisan.name : "manual assignment"}`);
    }
    if ((job.quote || "") !== data.quote) changes.push(`quote ${data.quote || "cleared"}`);
    if ((job.scheduledAt || "") !== data.scheduledAt) changes.push(`schedule ${data.scheduledAt || "cleared"}`);
    if ((job.completionProof || "") !== data.completionProof) changes.push("completion proof updated");
    job.status = data.status;
    job.artisanId = data.artisanId;
    job.quote = data.quote;
    job.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt).toISOString() : "";
    job.completionProof = data.completionProof;
    job.note = data.note;
    if (changes.length) addTimeline(job, "Job updated", changes.join("; "));
    if (data.note) addTimeline(job, "Internal note", data.note);
    saveState();
    renderAll();
    showToast(`${job.id} updated`);
  }
  els.jobDialog.close();
});

async function init() {
  await loadServerState();
  setupSelects();
  renderAll();
  if (apiMode) showToast("Connected to Briko local backend");
}

init();
