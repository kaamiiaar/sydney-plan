// Define the Sydney attractions with their details
const sydneyAttractions = [
  {
    name: "Sydney Opera House",
    details: "Iconic architectural masterpiece, UNESCO World Heritage site",
    area: "Circular Quay",
  },
  {
    name: "Sydney Harbour Bridge",
    details: "Climb the bridge for spectacular views",
    area: "The Rocks",
  },
  {
    name: "Bondi Beach",
    details: "Famous beach culture, coastal walks, surfing",
    area: "Eastern Suburbs",
  },
  {
    name: "Darling Harbour",
    details: "Entertainment precinct, aquarium, maritime museum",
    area: "City Center",
  },
  {
    name: "The Rocks",
    details: "Historic district, weekend markets, galleries",
    area: "City Center",
  },
];

// Add styles dynamically
const styles = `
    #container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    
    .attraction-item {
        background: #f5f5f5;
        margin: 10px 0;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        align-items: flex-start;
    }
    
    .attraction-item.checked {
        background: #e0ffe0;
    }
    
    .checkbox {
        margin-right: 15px;
        transform: scale(1.5);
    }
    
    .attraction-content {
        flex-grow: 1;
    }
    
    .attraction-name {
        font-weight: bold;
        font-size: 1.2em;
        margin-bottom: 5px;
    }
    
    .attraction-details {
        color: #666;
        margin-bottom: 5px;
    }
    
    .attraction-area {
        color: #888;
        font-size: 0.9em;
        font-style: italic;
    }
`;

// Add stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and populate the container
const container = document.getElementById("container");

// Add title
const title = document.createElement("h1");
title.textContent = "Sydney Travel Checklist";
title.style.textAlign = "center";
container.appendChild(title);

// Add attractions
sydneyAttractions.forEach((attraction) => {
  const item = document.createElement("div");
  item.className = "attraction-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.addEventListener("change", () => {
    item.classList.toggle("checked", checkbox.checked);
  });

  const content = document.createElement("div");
  content.className = "attraction-content";

  content.innerHTML = `
        <div class="attraction-name">${attraction.name}</div>
        <div class="attraction-details">${attraction.details}</div>
        <div class="attraction-area">📍 ${attraction.area}</div>
    `;

  item.appendChild(checkbox);
  item.appendChild(content);
  container.appendChild(item);
});
