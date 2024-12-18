// Add this at the start of your file
const FLICKR_API_KEY = "087a5964e56a78539f2cbc042de6f92a"; // You'll need to get this from Flickr

// Add Supabase client initialization at the top of the file
const SUPABASE_URL = "https://bkqvzvrzjolpesrkgyvh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcXZ6dnJ6am9scGVzcmtneXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODE0NDQsImV4cCI6MjA1MDA1NzQ0NH0.IJGy4mrtblAJkd5ufFQf4UOdezB8WqE5EWMG5yKe48c";

async function getFlickrImageUrl(searchTerm) {
  const endpoint = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${encodeURIComponent(
    searchTerm
  )}&sort=relevance&per_page=1&format=json&nojsoncallback=1&license=2,4,5,7&content_type=1&media=photos&safe_search=1&extras=url_c`;

  try {
    // Add error handling for network issues
    if (!navigator.onLine) {
      console.log("No internet connection available");
      return null;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors", // Explicitly set CORS mode
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.stat === "fail") {
      console.error("Flickr API error:", data.message);
      return null;
    }

    if (data.photos && data.photos.photo && data.photos.photo[0]) {
      const photo = data.photos.photo[0];
      const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`;

      // Verify the image URL is accessible
      const imgResponse = await fetch(imageUrl, { method: "HEAD" });
      if (!imgResponse.ok) {
        console.error("Image URL not accessible:", imageUrl);
        return null;
      }

      return imageUrl;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Flickr image:", error);
    return "https://via.placeholder.com/120x80?text=Image+Unavailable"; // Fallback image
  }
}

// Update the attractions data to include search terms
const dailyAttractions = {
  "Day 1 - Sunday, Dec 29": [
    {
      name: "Circular Quay",
      details: "Central transport hub with great views",
      area: "City Center",
      searchTerm: "Circular Quay Sydney",
    },
    {
      name: "Sydney Opera House",
      details: "Iconic architectural masterpiece, UNESCO World Heritage site",
      area: "Circular Quay",
      searchTerm: "Sydney Opera House Sydney",
    },
    {
      name: "Royal Botanic Gardens",
      details: "Beautiful gardens with harbor views, perfect for walking",
      area: "City Center",
      searchTerm: "Royal Botanic Gardens Sydney",
    },
  ],
  "Day 2 - Monday, Dec 30": [
    {
      name: "Sydney Harbour Bridge Climb",
      details: "Pre-booked climb experience with panoramic views",
      area: "The Rocks",
      searchTerm: "Sydney Harbour Bridge Climb Sydney",
    },
    {
      name: "The Rocks",
      details: "Historic district, weekend markets, galleries",
      area: "City Center",
      searchTerm: "The Rocks Sydney",
    },
    {
      name: "Manly Beach",
      details: "Beautiful beach area with coastal walks",
      area: "Northern Beaches",
      searchTerm: "Manly Beach Sydney",
    },
  ],
  "Day 3 - Tuesday, Dec 31": [
    {
      name: "Taronga Zoo",
      details: "Famous zoo with Australian wildlife and harbor views",
      area: "North Shore",
      searchTerm: "Taronga Zoo Sydney",
    },
    {
      name: "NYE Fireworks Viewing",
      details:
        "Choose from: Mrs Macquarie's Point, Bradfield Park, or Opera House area",
      area: "Various Locations",
      searchTerm: "NYE Fireworks Viewing Sydney",
    },
  ],
  "Day 4 - Wednesday, Jan 1": [
    {
      name: "Chinese Garden of Friendship",
      details: "Beautiful traditional Chinese garden",
      area: "Darling Harbour",
      searchTerm: "Chinese Garden of Friendship Sydney",
    },
    {
      name: "Darling Harbour",
      details: "Entertainment precinct, aquarium, maritime museum",
      area: "City Center",
      searchTerm: "Darling Harbour Sydney",
    },
    {
      name: "SEA LIFE Aquarium",
      details: "Optional visit - great for kids",
      area: "Darling Harbour",
      searchTerm: "SEA LIFE Aquarium Sydney",
    },
  ],
  "Day 5 - Thursday, Jan 2": [
    {
      name: "Bondi Beach",
      details: "Famous beach culture, coastal walks, surfing",
      area: "Eastern Suburbs",
      searchTerm: "Bondi Beach Sydney",
    },
    {
      name: "Bondi to Bronte Walk",
      details: "Scenic coastal walking trail",
      area: "Eastern Suburbs",
      searchTerm: "Bondi to Bronte Walk Sydney",
    },
    {
      name: "Westfield Bondi Junction",
      details: "Shopping center for retail therapy",
      area: "Eastern Suburbs",
      searchTerm: "Westfield Bondi Junction Sydney",
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
        gap: 15px;
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
    
    .day-overview {
        color: #666;
        font-size: 0.9em;
        margin-bottom: 20px;
        line-height: 1.4;
        padding: 0 10px;
    }
    
    .attraction-image {
        width: 120px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    .save-button {
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
    
    .save-button:hover {
        background-color: #45a049;
    }
`;

// Add stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and populate the container
const container = document.getElementById("container");

// Update the attraction item creation code
function renderAttractions() {
  const container = document.getElementById("container");
  container.innerHTML = ""; // Clear existing content

  // Add main title
  const mainTitle = document.createElement("h1");
  mainTitle.textContent = "Sydney Travel Checklist";
  mainTitle.style.textAlign = "center";
  container.appendChild(mainTitle);

  // Create sections for each day
  Object.entries(dailyAttractions).forEach(([day, attractions]) => {
    const daySection = document.createElement("div");
    daySection.className = "day-section";

    // Add day title
    const dayTitle = document.createElement("h2");
    dayTitle.textContent = day;
    daySection.appendChild(dayTitle);

    // Add day overview
    const dayOverview = document.createElement("div");
    dayOverview.className = "day-overview";

    // Set overview text based on the day
    let overviewText = "";
    if (day.includes("Dec 29")) {
      overviewText =
        "10:15 AM: Arrive in Sydney • Meet with cousin • Store luggage • Explore Circular Quay area • 3:00 PM: Check into Airbnb • Evening: Family dinner in Macquarie Park area";
    } else if (day.includes("Dec 30")) {
      overviewText =
        "Morning: Sydney Harbour Bridge Climb • Lunch at The Rocks • Afternoon: Ferry to Manly Beach • Beach time and coastal walk • Evening: Dinner at Manly Wharf";
    } else if (day.includes("Dec 31")) {
      overviewText =
        "Morning: Visit Taronga Zoo • Afternoon: Prepare for NYE celebrations • Evening: New Year's Eve festivities and fireworks viewing";
    } else if (day.includes("Jan 1")) {
      overviewText =
        "Late start (New Year's Day) • Brunch in local cafe • Visit Chinese Garden of Friendship • Darling Harbour exploration • Evening: Family time at Airbnb";
    } else if (day.includes("Jan 2")) {
      overviewText =
        "Morning: Visit Bondi Beach • Walk the Bondi to Bronte coastal path • Lunch at Bondi • Afternoon: Shopping at Westfield Bondi Junction • Evening: Family farewell dinner";
    }

    dayOverview.textContent = overviewText;
    daySection.appendChild(dayOverview);

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

      const image = document.createElement("img");
      image.className = "attraction-image";
      image.alt = attraction.name;
      // Only set the src if we have an image URL
      if (attraction.image) {
        image.src = attraction.image;
      } else {
        image.src = "https://via.placeholder.com/120x80?text=Loading...";
      }

      const content = document.createElement("div");
      content.className = "attraction-content";

      content.innerHTML = `
        <div class="attraction-name">${attraction.name}</div>
        <div class="attraction-details">${attraction.details}</div>
        <div class="attraction-area">📍 ${attraction.area}</div>
      `;

      item.appendChild(checkbox);
      item.appendChild(image);
      item.appendChild(content);
      daySection.appendChild(item);
    });

    container.appendChild(daySection);
  });

  // Add save button
  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.textContent = "Save Progress";
  saveButton.addEventListener("click", saveToSupabase);
  container.appendChild(saveButton);
}

async function convertImageToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    return null;
  }
}

async function initializeAttractions() {
  renderAttractions(); // First render with placeholders

  // Try to load cached images from localStorage
  const cachedImages = JSON.parse(
    localStorage.getItem("attractionImages") || "{}"
  );

  try {
    const updatedImages = {};

    for (const [day, attractions] of Object.entries(dailyAttractions)) {
      for (const attraction of attractions) {
        try {
          // Check if we have a cached image
          if (cachedImages[attraction.name]) {
            attraction.image = cachedImages[attraction.name];
            continue;
          }

          const imageUrl = await getFlickrImageUrl(
            attraction.searchTerm || attraction.name
          );

          if (imageUrl && !imageUrl.includes("placeholder")) {
            // Convert image to base64 and store it
            const base64Image = await convertImageToBase64(imageUrl);
            if (base64Image) {
              attraction.image = base64Image;
              updatedImages[attraction.name] = base64Image;
            } else {
              attraction.image =
                "https://via.placeholder.com/120x80?text=No+Image";
              updatedImages[attraction.name] = attraction.image;
            }
          } else {
            attraction.image =
              "https://via.placeholder.com/120x80?text=No+Image";
            updatedImages[attraction.name] = attraction.image;
          }
        } catch (error) {
          console.warn(`Failed to load image for ${attraction.name}:`, error);
          attraction.image = "https://via.placeholder.com/120x80?text=Error";
          updatedImages[attraction.name] = attraction.image;
        }
      }
    }

    // Update the cache with new images
    localStorage.setItem(
      "attractionImages",
      JSON.stringify({
        ...cachedImages,
        ...updatedImages,
      })
    );

    renderAttractions(); // Re-render with actual images
  } catch (error) {
    console.error("Failed to initialize attractions:", error);
  }
}

// Call this instead of directly rendering
initializeAttractions();

// Add function to save data to Supabase
async function saveToSupabase() {
  try {
    const checkedAttractions = [];
    document.querySelectorAll(".attraction-item").forEach((item) => {
      const checkbox = item.querySelector(".checkbox");
      const name = item.querySelector(".attraction-name").textContent;
      const area = item
        .querySelector(".attraction-area")
        .textContent.replace("📍 ", "");
      const details = item.querySelector(".attraction-details").textContent;

      if (checkbox.checked) {
        checkedAttractions.push({
          destination_name: name, // Changed to match table column
          area: area,
          details: details,
          checked: true,
          checked_at: new Date().toISOString(),
        });
      }
    });

    // Using the 'destinations' table instead of 'locations'
    const response = await fetch(`${SUPABASE_URL}/rest/v1/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(checkedAttractions),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save data: ${response.status} ${response.statusText}`
      );
    }

    alert("Progress saved successfully!");
  } catch (error) {
    console.error("Error saving to Supabase:", error);
    alert("Failed to save progress. Please try again.");
  }
}
