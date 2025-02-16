/* ================================
   BOOK PAGE
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("booking-form");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Collect form input values
            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const eventDate = document.getElementById("eventDate").value;
            const eventDetails = document.getElementById("eventDetails").value.trim();
            const guestCount = document.getElementById("guestCount").value;
            const startTime = document.getElementById("startTime").value;
            const endTime = document.getElementById("endTime").value;

            // Ensure all fields are filled
            if (!fullName || !email || !phone || !eventDate || !startTime || !endTime) {
                alert("Please fill out all required fields before booking.");
                return;
            }

            // Validate date (must be today or later)
            const today = new Date().toISOString().split("T")[0];
            if (eventDate < today) {
                alert("Please select a valid event date (today or later).");
                return;
            }

            // Validate time (must be within business hours)
            const openingTime = 7.5; // 7:30 AM in decimal
            const closingTime = 26.0; // 2:00 AM (next day as 26 hours)
            
            function timeToDecimal(time) {
                const [hours, minutes] = time.split(":").map(Number);
                return hours + minutes / 60;
            }

            const startDecimal = timeToDecimal(startTime);
            const endDecimal = timeToDecimal(endTime);

            if (startDecimal < openingTime || endDecimal > closingTime) {
                alert("Please select a time between 7:30 AM and 2:00 AM.");
                return;
            }

            // Ensure minimum booking time is 30 minutes
            const bookingDuration = endDecimal - startDecimal;
            if (bookingDuration < 0.5) {
                alert("Bookings must be at least 30 minutes long.");
                return;
            }

            // Calculate total cost ($99 per hour, rounded to nearest half-hour)
            const totalCost = (Math.ceil(bookingDuration * 2) / 2) * 99;

            // Generate a random booking ID
            const bookingId = `999-${Math.floor(100 + Math.random() * 900)}`;

            // Store booking data in localStorage
            const bookingData = {
                bookingId,
                fullName,
                email,
                phone,
                eventDate,
                eventDetails,
                guestCount,
                startTime,
                endTime,
                totalCost
            };

            localStorage.setItem("bookingData", JSON.stringify(bookingData));

            // Redirect to confirmation page
            window.location.href = "confirmation.html";
        });
    }

    /* ================================
         CONFIRMATION PAGE
      ================================ */
    // Load booking data on the confirmation page
    if (window.location.pathname.includes("confirmation.html")) {
        const storedBooking = localStorage.getItem("bookingData");

        if (storedBooking) {
            const data = JSON.parse(storedBooking);

            // Ensure these IDs exist in confirmation.html
            document.getElementById("bookingId").textContent = data.bookingId || "N/A";
            document.getElementById("date").textContent = data.eventDate || "N/A";
            document.getElementById("startTime").textContent = data.startTime || "N/A";
            document.getElementById("endTime").textContent = data.endTime || "N/A";
            document.getElementById("totalCost").textContent = `$${data.totalCost.toFixed(2)}`;
            document.getElementById("guestCount").textContent = data.guestCount || "N/A";
            document.getElementById("eventDetails").textContent = data.eventDetails || "N/A";
            document.getElementById("fullName").textContent = data.fullName || "N/A";
            document.getElementById("email").textContent = data.email || "N/A";
            document.getElementById("phone").textContent = data.phone || "N/A";
        }
    }
});

