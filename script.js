document.addEventListener("DOMContentLoaded", function () {
    const colorBox = document.getElementById("color-box");
    const result = document.getElementById("result");
    const colorOptions = Array.from(document.getElementsByClassName("color-option"));
    const timeLeftDisplay = document.getElementById("time-left");
    const betAmountInput = document.getElementById("bet-amount");
    const betButton = document.getElementById("bet-button");
    const betSection = document.getElementById("bet-section");
    const walletBalanceDisplay = document.getElementById("wallet-balance");
    const countdownSound = document.getElementById("countdown-sound");

    const colors = [
        { name: "Red", code: "#FF0000", bet: 0 },
        { name: "Blue", code: "#0000FF", bet: 0 },
        { name: "Green", code: "#00FF00", bet: 0 },
        { name: "Yellow", code: "#FFFF00", bet: 0 },
    ];

    let correctColor;
    let timer;
    let walletBalance = 500; // Initial wallet balance
    let selectedColors = []; // To keep track of colors player has selected

    // Function to set up a new round
    function setNewRound() {
        result.textContent = "";
        timeLeftDisplay.textContent = 10;

        // Reset color box and betting data
        colorBox.style.backgroundColor = "#ffffff";
        correctColor = colors[Math.floor(Math.random() * colors.length)];
        colors.forEach(color => {
            color.bet = 0; // Reset each color's bet
            document.getElementById(`${color.name.toLowerCase()}-bet`).textContent = `Bet on ${color.name}: 0 Rs`;
        });

        betSection.style.display = "none"; // Hide the betting section
        selectedColors = []; // Clear selected colors
        colorOptions.forEach(button => {
            button.disabled = false; // Enable all buttons for new round
        });

        startTimer(); // Start the countdown timer
    }

    // Function to start the timer countdown
    function startTimer() {
        let timeLeft = 10;
        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;

            // Play the countdown sound
            if (timeLeft > 0) {
                countdownSound.currentTime = 0; // Restart sound from beginning
                countdownSound.play();
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                revealResult();
            }
        }, 1000);
    }

    // Function to reveal the result after 10 seconds
    function revealResult() {
        colorBox.style.backgroundColor = correctColor.code; // Show the correct color
        result.textContent = `The correct color was ${correctColor.name}.`;

        // Check for wins
        colors.forEach(color => {
            if (color.name === correctColor.name) {
                // Update wallet balance for win
                walletBalance += color.bet + (color.bet * 0.9); // Return bet + 90% of the bet amount
            }
            // Clear the bet amount for each color after the round
            color.bet = 0;
        });

        walletBalanceDisplay.textContent = `${walletBalance.toFixed(2)} Rs`; // Update wallet balance

        // Quickly clear the color and start a new round after 2 seconds
        setTimeout(() => {
            colorBox.style.backgroundColor = "#ffffff"; // Clear the color box
            setNewRound(); // Start a new round
        }, 2000);
    }

    // Function to handle the player's guess and show betting options
    function handlePlayerGuess(selectedColor) {
        // Check if the selected color is already in the selectedColors array
        if (!selectedColors.includes(selectedColor)) {
            selectedColors.push(selectedColor); // Add selected color to array
        }
        betSection.style.display = "block"; // Show the betting section
        colorOptions.forEach(button => button.disabled = true); // Disable all buttons

        // Enable the color buttons for re-selection
        selectedColors.forEach(color => {
            const button = colorOptions.find(btn => btn.innerText === color);
            if (button) button.disabled = false; // Re-enable buttons for selected colors
        });
    }

    // Attach event listener to the bet button
    betButton.addEventListener("click", function () {
        const betValue = parseInt(betAmountInput.value);

        // Check if bet amount is valid and within limits
        if (isNaN(betValue) || betValue < 1 || betValue > 500) {
            alert("Please enter a valid bet amount between 1 and 500.");
            return;
        }

        // Check if sufficient wallet balance is available
        if (betValue > walletBalance) {
            alert("Insufficient wallet balance for this bet.");
            return;
        }

        // Update bets for each selected color
        selectedColors.forEach(selectedColor => {
            const color = colors.find(color => color.name === selectedColor);
            if (color) {
                color.bet += betValue; // Increase the bet amount for the selected color
                walletBalance -= betValue; // Deduct the bet amount from wallet balance

                // Update the bet display for the selected color
                document.getElementById(`${color.name.toLowerCase()}-bet`).textContent = `Bet on ${color.name}: ${color.bet} Rs`;
            }
        });

        // Update wallet balance display
        walletBalanceDisplay.textContent = `${walletBalance.toFixed(2)} Rs`;
        betAmountInput.value = ""; // Clear bet amount input after placing the bet
    });

    // Attach event listeners to color buttons
    colorOptions.forEach(option => {
        option.addEventListener("click", function () {
            handlePlayerGuess(this.innerText); // Handle the player's guess based on button text
        });
    });

    // Start the first round when the page loads
    setNewRound();
});
