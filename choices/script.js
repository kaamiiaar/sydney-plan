// Add Supabase client initialization
const SUPABASE_URL = "https://bkqvzvrzjolpesrkgyvh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcXZ6dnJ6am9scGVzcmtneXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODE0NDQsImV4cCI6MjA1MDA1NzQ0NH0.IJGy4mrtblAJkd5ufFQf4UOdezB8WqE5EWMG5yKe48c";

// Add styles
const styles = `
    #container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        font-family: Arial, sans-serif;
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
    
    .attraction-item {
        background: #f5f5f5;
        margin: 10px 0;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        align-items: flex-start;
        gap: 15px;
    }
    
    .attraction-item.checked {
        background: #e0ffe0;
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
    
    .back-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background-color 0.3s;
    }
    
    .back-button:hover {
        background-color: #45a049;
    }

    .timestamp {
        text-align: center;
        color: #666;
        margin-bottom: 20px;
        font-style: italic;
    }

    .loading {
        text-align: center;
        padding: 20px;
        font-size: 1.2em;
        color: #666;
    }
`;

// Add stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

async function fetchSavedChoices() {
  // Show loading state immediately
  const container = document.getElementById("container");
  container.innerHTML = '<div class="loading">Loading saved choices...</div>';

  // Initialize Supabase client outside the try block
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Add timeout to handle very slow responses
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    const fetchPromise = supabase
      .from("destinations")
      .select("*")
      .order("last_updated", { ascending: false })
      .limit(1);

    // Race between fetch and timeout
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML =
        '<div class="loading">No saved choices found.</div>';
      return;
    }

    const savedData = data[0];
    const checklistData = savedData.checklist_data;

    // Clear loading message
    container.innerHTML = "";

    // Add main title
    const mainTitle = document.createElement("h1");
    mainTitle.textContent = "Saved Choices - Sydney Travel Checklist";
    mainTitle.style.textAlign = "center";
    container.appendChild(mainTitle);

    // Add timestamp
    const timestamp = document.createElement("div");
    timestamp.className = "timestamp";
    timestamp.textContent = `Last updated: ${new Date(
      savedData.last_updated
    ).toLocaleString()}`;
    container.appendChild(timestamp);

    // Render each day section
    Object.entries(checklistData).forEach(([day, attractions]) => {
      const daySection = document.createElement("div");
      daySection.className = "day-section";

      const dayTitle = document.createElement("h2");
      dayTitle.textContent = day;
      daySection.appendChild(dayTitle);

      attractions.forEach((attraction) => {
        const item = document.createElement("div");
        item.className = `attraction-item${
          attraction.checked ? " checked" : ""
        }`;

        const content = document.createElement("div");
        content.className = "attraction-content";

        content.innerHTML = `
          <div class="attraction-name">${attraction.name}</div>
          <div class="attraction-details">${attraction.details}</div>
          <div class="attraction-area">📍 ${attraction.area}</div>
        `;

        item.appendChild(content);
        daySection.appendChild(item);
      });

      container.appendChild(daySection);
    });

    // Add back button
    const backButton = document.createElement("button");
    backButton.className = "back-button";
    backButton.textContent = "Back to Checklist";
    backButton.onclick = () => (window.location.href = "/");
    container.appendChild(backButton);
  } catch (error) {
    console.error("Error fetching saved choices:", error);
    container.innerHTML = `<div class="loading">Error loading saved choices: ${error.message}</div>`;
  }
}

// Initialize Supabase client once, outside the function
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize the page
document.addEventListener("DOMContentLoaded", fetchSavedChoices);
