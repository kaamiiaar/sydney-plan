// Define the Sydney attractions grouped by day
const dailyAttractions = {
  "Day 1 - Sunday, Dec 29": [
    {
      name: "Circular Quay",
      details: "Central transport hub with great views",
      area: "City Center",
    },
    {
      name: "Sydney Opera House",
      details: "Iconic architectural masterpiece, UNESCO World Heritage site",
      area: "Circular Quay",
    },
    {
      name: "Royal Botanic Gardens",
      details: "Beautiful gardens with harbor views, perfect for walking",
      area: "City Center",
    },
  ],
  "Day 2 - Monday, Dec 30": [
    {
      name: "Sydney Harbour Bridge Climb",
      details: "Pre-booked climb experience with panoramic views",
      area: "The Rocks",
    },
    {
      name: "The Rocks",
      details: "Historic district, weekend markets, galleries",
      area: "City Center",
    },
    {
      name: "Manly Beach",
      details: "Beautiful beach area with coastal walks",
      area: "Northern Beaches",
    },
  ],
  "Day 3 - Tuesday, Dec 31": [
    {
      name: "Taronga Zoo",
      details: "Famous zoo with Australian wildlife and harbor views",
      area: "North Shore",
    },
    {
      name: "NYE Fireworks Viewing",
      details:
        "Choose from: Mrs Macquarie's Point, Bradfield Park, or Opera House area",
      area: "Various Locations",
    },
  ],
  "Day 4 - Wednesday, Jan 1": [
    {
      name: "Chinese Garden of Friendship",
      details: "Beautiful traditional Chinese garden",
      area: "Darling Harbour",
    },
    {
      name: "Darling Harbour",
      details: "Entertainment precinct, aquarium, maritime museum",
      area: "City Center",
    },
    {
      name: "SEA LIFE Aquarium",
      details: "Optional visit - great for kids",
      area: "Darling Harbour",
    },
  ],
  "Day 5 - Thursday, Jan 2": [
    {
      name: "Bondi Beach",
      details: "Famous beach culture, coastal walks, surfing",
      area: "Eastern Suburbs",
    },
    {
      name: "Bondi to Bronte Walk",
      details: "Scenic coastal walking trail",
      area: "Eastern Suburbs",
    },
    {
      name: "Westfield Bondi Junction",
      details: "Shopping center for retail therapy",
      area: "Eastern Suburbs",
    },
  ],
};

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
    
    .day-section {
        margin-bottom: 40px;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 20px;
    }
    
    .day-section h2 {
        color: #2c3e50;
        margin-top: 0;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #eee;
    }
`;

// Add stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and populate the container
const container = document.getElementById("container");

// Add main title
const mainTitle = document.createElement("h1");
mainTitle.textContent = "Sydney Travel Checklist";
mainTitle.style.textAlign = "center";
container.appendChild(mainTitle);

// Create sections for each day
Object.entries(dailyAttractions).forEach(([day, attractions]) => {
  // Create day section
  const daySection = document.createElement("div");
  daySection.className = "day-section";

  // Add day title
  const dayTitle = document.createElement("h2");
  dayTitle.textContent = day;
  daySection.appendChild(dayTitle);

  // Add attractions for this day
  attractions.forEach((attraction) => {
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
    daySection.appendChild(item);
  });

  container.appendChild(daySection);
});
