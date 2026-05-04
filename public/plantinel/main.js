import { generatePlantinelCard } from "../../src/frontend/mock-ai.js";
import { getLibraryData } from "../../src/frontend/data-layer.js";

const tabButtons = [...document.querySelectorAll("[data-tab]")];
const tabSections = [...document.querySelectorAll(".tab")];
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const captureInput = document.getElementById("captureInput");
const inputLabel = document.getElementById("inputLabel");
const generatedCard = document.getElementById("generatedCard");
const plantGrid = document.getElementById("plantGrid");
const remedyList = document.getElementById("remedyList");
const exploreGrid = document.getElementById("exploreGrid");
const librarySearch = document.getElementById("librarySearch");

const modeCopy = {
  symptom: {
    label: "Describe your symptom",
    placeholder: "Example: I have a dry cough and sore throat..."
  },
  plant: {
    label: "Type a plant name or local alias",
    placeholder: "Example: Kopto, Névédé, moringa, bitter leaf..."
  },
  photo: {
    label: "Describe the plant photo for this MVP",
    placeholder: "Example: green leaves, small round leaflets, from Niger..."
  },
  text: {
    label: "Paste a remedy note, screenshot text, or link",
    placeholder: "Example: Boil ginger, lemon and honey for cough..."
  }
};

function setTab(nextTab) {
  tabSections.forEach((section) => section.classList.toggle("active", section.id === nextTab));
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === nextTab));
}

function setMode(mode) {
  modeButtons.forEach((button) => button.classList.toggle("selected", button.dataset.mode === mode));
  inputLabel.textContent = modeCopy[mode].label;
  captureInput.placeholder = modeCopy[mode].placeholder;
}

function renderGeneratedCard(card) {
  generatedCard.innerHTML = `
    <article class="result-card">
      <div class="result-header">
        <span>${card.cardType}</span>
        <strong>${card.evidenceLevel}</strong>
      </div>
      <h3>${card.title}</h3>
      <p class="latin">${card.latinName}</p>
      <div class="tags">
        ${card.aliases.map((alias) => `<span>${alias}</span>`).join("")}
      </div>
      <section>
        <h4>EN · Traditional use</h4>
        <p>${card.uses.en}</p>
      </section>
      <section>
        <h4>FR · Usage traditionnel</h4>
        <p>${card.uses.fr}</p>
      </section>
      <section>
        <h4>Preparation</h4>
        <ol>${card.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      </section>
      <section class="notice">
        <h4>Safety disclaimer</h4>
        <p>${card.safety}</p>
      </section>
      <section class="folklore">
        <h4>Folklore, unverified</h4>
        <p>${card.folklore}</p>
      </section>
      <div class="store-strip">
        <div>
          <strong>${card.product.name}</strong>
          <p>${card.product.detail}</p>
        </div>
        <button type="button">${card.product.cta}</button>
      </div>
    </article>
  `;
}

function renderPlants(plants) {
  plantGrid.innerHTML = plants
    .map(
      (plant) => `
        <article class="plant-tile">
          <div class="tile-image ${plant.theme}"></div>
          <div class="tile-body">
            <span>${plant.evidence}</span>
            <h4>${plant.name}</h4>
            <p>${plant.latin}</p>
            <div class="mini-tags">${plant.aliases.map((alias) => `<em>${alias}</em>`).join("")}</div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderRemedies(remedies) {
  remedyList.innerHTML = remedies
    .map(
      (remedy) => `
        <article class="remedy-card">
          <div class="remedy-thumb ${remedy.theme}"></div>
          <div>
            <h4>${remedy.title}</h4>
            <p>${remedy.description}</p>
            <div class="remedy-meta">
              <span>${remedy.prep}</span>
              <span>${remedy.evidence}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderExplore(items) {
  exploreGrid.innerHTML = items
    .map(
      (item) => `
        <article>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setTab(button.dataset.tab));
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    captureInput.value = button.dataset.example;
    captureInput.focus();
  });
});

document.getElementById("generateCard").addEventListener("click", async () => {
  const activeMode = document.querySelector("[data-mode].selected").dataset.mode;
  const card = await generatePlantinelCard({
    input: captureInput.value,
    mode: activeMode
  });
  renderGeneratedCard(card);
});

librarySearch.addEventListener("input", async () => {
  const { plants } = await getLibraryData();
  const query = librarySearch.value.toLowerCase();
  renderPlants(
    plants.filter((plant) =>
      [plant.name, plant.latin, ...plant.aliases, plant.uses].join(" ").toLowerCase().includes(query)
    )
  );
});

const { plants, remedies } = await getLibraryData();
renderPlants(plants);
renderRemedies(remedies);
renderExplore([
  {
    title: "All Cards",
    description: "Plant, Remedy, Folklore, and Nutrition cards with confidence and caution labels."
  },
  {
    title: "Community Review",
    description: "Experiences and cultural stories should be moderated before public display."
  },
  {
    title: "Products",
    description: "Plantinel products lead, followed by transparent affiliate and sponsored placements."
  },
  {
    title: "Legal",
    description: "Medical disclaimer, privacy policy, terms, and affiliate disclosure stay accessible."
  }
]);
