document.addEventListener("DOMContentLoaded", () => {
  // today datee
  const dateInput = document.getElementById("date")
  const today = new Date()
  const formattedDate = today.toISOString().split("T")[0]
  dateInput.min = formattedDate
  dateInput.value = formattedDate

  // 3 tabs switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab")

      // remove active form other 2 tabs
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabPanes.forEach((p) => p.classList.remove("active"))

      // add active on clicked tab
      btn.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // display cstom time on rides tab
  const rideTimeSelect = document.getElementById("ride-time")
  const customTimeGroup = document.getElementById("custom-time-group")

  rideTimeSelect.addEventListener("change", () => {
    if (rideTimeSelect.value === "custom") {
      customTimeGroup.style.display = "block"
    } else {
      customTimeGroup.style.display = "none"
    }
  })

  // filter cars in ride
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // filter logic
    })
  })

  // modal functionality
  const modals = document.querySelectorAll(".modal")
  const closeModalBtns = document.querySelectorAll(".close-modal, .close-modal-btn")

  // close modal when clicking close button or outside the modal
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modals.forEach((modal) => {
        modal.style.display = "none"
      })
    })
  })

  window.addEventListener("click", (e) => {
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  })

  // parking search functionality
  const searchBtn = document.getElementById("search-btn")
  const parkingResults = document.querySelector("#parking-results .results-container")
  const mapPlaceholder = document.querySelector(".map-placeholder")
  const mapView = document.querySelector(".map-view")
  const parkingGrid = document.querySelector(".parking-grid")

  searchBtn.addEventListener("click", () => {
    const location = document.getElementById("location").value
    const date = document.getElementById("date").value
    const time = document.getElementById("time").value
    const duration = document.getElementById("duration").value

    if (!location || !date || !time || !duration) {
      alert("Please fill in all fields")
      return
    }

    // simulate loading
    parkingResults.innerHTML = '<div class="loading">Searching for available spots...</div>'

    // simulate API call with setTimeout
    setTimeout(() => {
      // generate parking spots
      generateParkingSpots(location)

      // show parking map
      mapPlaceholder.style.display = "none"
      mapView.style.display = "block"

      // generate parking grid
      generateParkingGrid()
    }, 1500)
  })

  // generate parking spots
  function generateParkingSpots(location) {
    // clear previous results
    parkingResults.innerHTML = ""

    // locations data (in a real app, this would come from an API)
    const locationNames = {
      central: "Central Station",
      north: "North Terminal",
      east: "East Junction",
      west: "West Gate",
      south: "South Plaza",
    }

    // generate 4 random parking spots
    for (let i = 1; i <= 4; i++) {
      const isPremium = i === 1 // first spot is premium
      const spotType = isPremium ? "Premium" : "Standard"
      const basePrice = isPremium ? 80 : 50
      const duration = document.getElementById("duration").value
      const price = basePrice * (duration === "24" ? 4 : duration / 2)

      const spotHtml = `
                <div class="parking-spot" data-spot-id="spot-${i}" data-price="${price}" data-type="${spotType.toLowerCase()}">
                    <div class="spot-header">
                        <div class="spot-name">Spot ${String.fromCharCode(64 + i)}${i}</div>
                        <div class="spot-type">${spotType}</div>
                    </div>
                    <div class="spot-details">
                        <div class="spot-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${locationNames[location]} Parking</span>
                        </div>
                        <div class="spot-detail">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${isPremium ? "Large" : "Standard"} Size</span>
                        </div>
                        <div class="spot-detail">
                            <i class="fas fa-walking"></i>
                            <span>${Math.floor(Math.random() * 5) + 1} min walk to metro</span>
                        </div>
                        ${
                          isPremium
                            ? `
                        <div class="spot-detail">
                            <i class="fas fa-shield-alt"></i>
                            <span>CCTV Surveillance</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="spot-price">
                        <div>
                            <div class="price">₹${price}</div>
                            <div class="price-note">for selected duration</div>
                        </div>
                        <button class="book-btn" data-spot-id="spot-${i}">Book Now</button>
                    </div>
                </div>
            `

      parkingResults.innerHTML += spotHtml
    }

    // add event listeners to book buttons
    const bookBtns = document.querySelectorAll(".book-btn")
    bookBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const spotId = e.target.getAttribute("data-spot-id")
        const spotElement = document.querySelector(`.parking-spot[data-spot-id="${spotId}"]`)
        const spotName = spotElement.querySelector(".spot-name").textContent
        const spotPrice = spotElement.getAttribute("data-price")
        const spotType = spotElement.getAttribute("data-type")

        // Fill modal with booking details
        document.getElementById("modal-location").textContent = locationNames[location]
        document.getElementById("modal-date").textContent = document.getElementById("date").value
        document.getElementById("modal-time").textContent = document.getElementById("time").value
        document.getElementById("modal-duration").textContent =
          `${document.getElementById("duration").value} ${document.getElementById("duration").value === "24" ? "hours (Full Day)" : "hours"}`
        document.getElementById("modal-spot").textContent = `${spotName} (${spotType})`
        document.getElementById("modal-price").textContent = `₹${spotPrice}`

        // Show booking modal
        document.getElementById("booking-modal").style.display = "flex"
      })
    })
  }

  // Generate parking grid
  function generateParkingGrid() {
    // Clear previous grid
    parkingGrid.innerHTML = ""

    // Generate 5x4 grid of parking cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const cellId = `cell-${row}-${col}`
        const isAvailable = Math.random() > 0.3 // 70% chance of being available
        const isPremium = row === 0 && (col === 2 || col === 3) // Some premium spots

        const cellClass = `parking-cell ${isAvailable ? "available" : "occupied"} ${isPremium ? "premium" : ""}`
        const cellLabel = String.fromCharCode(65 + row) + (col + 1)

        const cellHtml = `<div id="${cellId}" class="${cellClass}" data-row="${row}" data-col="${col}">${cellLabel}</div>`
        parkingGrid.innerHTML += cellHtml
      }
    }

    // Add event listeners to available cells
    const availableCells = document.querySelectorAll(".parking-cell.available")
    availableCells.forEach((cell) => {
      cell.addEventListener("click", () => {
        // Remove selected class from all cells
        document.querySelectorAll(".parking-cell").forEach((c) => c.classList.remove("selected"))

        // Add selected class to clicked cell
        cell.classList.add("selected")
      })
    })
  }

  // Ride search functionality
  const rideSearchBtn = document.getElementById("ride-search-btn")
  const rideResults = document.querySelector(".ride-results")

  rideSearchBtn.addEventListener("click", () => {
    const from = document.getElementById("ride-from").value
    const to = document.getElementById("ride-to").value
    const when = document.getElementById("ride-time").value

    if (!from || !to) {
      alert("Please fill in all required fields")
      return
    }

    // Simulate loading
    rideResults.innerHTML = '<div class="loading">Searching for available rides...</div>'

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate ride options
      generateRideOptions(from, to, when)
    }, 1500)
  })

  // Generate ride options
  function generateRideOptions(from, to, when) {
    // Clear previous results
    rideResults.innerHTML = ""

    // Locations data
    const locationNames = {
      central: "Central Station",
      north: "North Terminal",
      east: "East Junction",
      west: "West Gate",
      south: "South Plaza",
    }

    // Ride types
    const rideTypes = [
      { type: "cab", icon: "fa-taxi", name: "Cab", basePrice: 120 },
      { type: "shuttle", icon: "fa-shuttle-van", name: "Shuttle", basePrice: 80 },
      { type: "erickshaw", icon: "fa-truck-pickup", name: "E-Rickshaw", basePrice: 60 },
    ]

    // Generate ride options
    rideTypes.forEach((ride) => {
      const arrivalTime = when === "now" ? "5-10 min" : when === "custom" ? "At selected time" : `In ${when} min`

      const distance = Math.floor(Math.random() * 8) + 2 // 2-10 km
      const price = ride.basePrice + distance * 10
      const poolingAvailable = ride.type !== "erickshaw"

      const rideHtml = `
                <div class="ride-option" data-ride-type="${ride.type}" data-price="${price}">
                    <div class="ride-header">
                        <div class="ride-type">
                            <i class="fas ${ride.icon}"></i>
                            <span>${ride.name}</span>
                        </div>
                        <div class="ride-time">${arrivalTime}</div>
                    </div>
                    <div class="ride-details">
                        <div class="ride-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>From: ${locationNames[from]}</span>
                        </div>
                        <div class="ride-detail">
                            <i class="fas fa-location-arrow"></i>
                            <span>To: ${to}</span>
                        </div>
                        <div class="ride-detail">
                            <i class="fas fa-route"></i>
                            <span>Distance: ${distance} km</span>
                        </div>
                        <div class="ride-detail">
                            <i class="fas fa-clock"></i>
                            <span>Est. travel time: ${Math.floor(distance * 3) + 5} min</span>
                        </div>
                        ${
                          poolingAvailable
                            ? `
                        <div class="ride-detail">
                            <i class="fas fa-users"></i>
                            <span>Pooling available (save up to 30%)</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="ride-price">
                        <div>
                            <div class="price">₹${price}</div>
                            <div class="price-note">one way</div>
                        </div>
                        <button class="book-btn" data-ride-type="${ride.type}">Book Now</button>
                    </div>
                </div>
            `

      rideResults.innerHTML += rideHtml
    })

    // Add event listeners to book buttons
    const rideBookBtns = document.querySelectorAll(".ride-option .book-btn")
    rideBookBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rideType = e.target.getAttribute("data-ride-type")
        const rideElement = e.target.closest(".ride-option")
        const ridePrice = rideElement.getAttribute("data-price")

        // Fill modal with ride details
        document.getElementById("ride-modal-from").textContent = locationNames[from]
        document.getElementById("ride-modal-to").textContent = to
        document.getElementById("ride-modal-time").textContent =
          when === "now"
            ? "As soon as possible"
            : when === "custom"
              ? document.getElementById("custom-time").value
              : `In ${when} minutes`
        document.getElementById("ride-modal-type").textContent = rideType.charAt(0).toUpperCase() + rideType.slice(1)
        document.getElementById("ride-modal-price").textContent = `₹${ridePrice}`

        // Show ride booking modal
        document.getElementById("ride-modal").style.display = "flex"
      })
    })
  }

  // Confirm booking functionality
  const confirmBookingBtn = document.getElementById("confirm-booking")

  confirmBookingBtn.addEventListener("click", () => {
    const vehicleNumber = document.getElementById("vehicle-number").value

    if (!vehicleNumber) {
      alert("Please enter your vehicle number")
      return
    }

    // Hide booking modal
    document.getElementById("booking-modal").style.display = "none"

    // Generate booking ID
    const bookingId =
      "PNR" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    document.getElementById("booking-id").textContent = bookingId

    // Set success message
    document.getElementById("success-message").textContent =
      "Your parking has been successfully booked. A confirmation has been sent to your email."

    // Show success modal
    document.getElementById("success-modal").style.display = "flex"
  })

  // Confirm ride functionality
  const confirmRideBtn = document.getElementById("confirm-ride")

  confirmRideBtn.addEventListener("click", () => {
    // Hide ride modal
    document.getElementById("ride-modal").style.display = "none"

    // Generate booking ID
    const bookingId =
      "RID" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    document.getElementById("booking-id").textContent = bookingId

    // Set success message
    document.getElementById("success-message").textContent =
      "Your ride has been successfully booked. Driver details will be sent to your phone."

    // Show success modal
    document.getElementById("success-modal").style.display = "flex"
  })

  // Offline mode detection
  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)

  function updateOnlineStatus() {
    const offlineBanner = document.getElementById("offline-banner")

    if (navigator.onLine) {
      offlineBanner.style.display = "none"
    } else {
      offlineBanner.style.display = "flex"
    }
  }

  // Initial check
  updateOnlineStatus()

  // Simulate dynamic pricing
  function updateDynamicPricing() {
    const now = new Date()
    const hour = now.getHours()

    // Peak hours: 8-10 AM and 5-7 PM
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)

    // Update pricing display if needed
    const priceElements = document.querySelectorAll(".price")
    priceElements.forEach((el) => {
      if (el.dataset.basePrice) {
        const basePrice = Number.parseInt(el.dataset.basePrice)
        const newPrice = isPeakHour ? Math.floor(basePrice * 1.25) : basePrice
        el.textContent = `₹${newPrice}`

        // Add surge indicator during peak hours
        if (isPeakHour && !el.nextElementSibling?.classList.contains("surge-indicator")) {
          const surgeIndicator = document.createElement("div")
          surgeIndicator.classList.add("surge-indicator")
          surgeIndicator.innerHTML = '<i class="fas fa-arrow-up"></i> Peak hour pricing'
          surgeIndicator.style.color = "var(--warning-color)"
          surgeIndicator.style.fontSize = "0.8rem"
          surgeIndicator.style.marginTop = "0.25rem"
          el.parentNode.appendChild(surgeIndicator)
        }
      }
    })
  }

  // Update pricing every 5 minutes
  updateDynamicPricing()
  setInterval(updateDynamicPricing, 5 * 60 * 1000)

  // Download pass functionality
  const downloadPassBtn = document.getElementById("download-pass")

  downloadPassBtn.addEventListener("click", () => {
    alert("Pass downloaded successfully. You can access it offline from your device.")
  })

  // View bookings functionality
  const viewBookingsBtn = document.getElementById("view-bookings")

  viewBookingsBtn.addEventListener("click", () => {
    // Hide success modal
    document.getElementById("success-modal").style.display = "none"

    // Switch to My Bookings tab (in a real app)
    alert("Redirecting to My Bookings page...")
  })

  // Cache important data for offline access
  if ("cacheStorage" in window) {
    // Cache booking data
    const bookingData = {
      id: document.getElementById("booking-id").textContent,
      location: document.getElementById("modal-location").textContent,
      date: document.getElementById("modal-date").textContent,
      time: document.getElementById("modal-time").textContent,
    }

    localStorage.setItem("lastBooking", JSON.stringify(bookingData))
  }
})

