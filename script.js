document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommendation-form');
    const cardioList = document.getElementById('cardio-list');
    const strengthList = document.getElementById('strength-list');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ageInput = document.getElementById('age');
        const weightInput = document.getElementById('weight');
        const age = parseInt(ageInput.value);
        const weight = parseInt(weightInput.value);

        if (isNaN(age) || isNaN(weight) || age <= 0 || weight <= 0) {
            alert('Please enter a valid age and weight.');
            return;
        }

        try {
            // Make a POST request to the Flask server
            const response = await fetch('/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ age: age, weight: weight })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayRecommendations(data);

        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('An error occurred. Please check the browser console for more details.');
        }
    });

    /**
     * Displays a list of recommendations on the webpage.
     * @param {object} data - An object containing 'cardio' and 'strength' workout arrays.
     */
    function displayRecommendations(data) {
        // Clear previous recommendations
        cardioList.innerHTML = '';
        strengthList.innerHTML = '';

        // Display Cardio Workouts
        if (Array.isArray(data.cardio)) {
            data.cardio.forEach(workout => {
                const li = document.createElement('li');
                li.textContent = workout;
                cardioList.appendChild(li);
            });
        }

        // Display Strength Workouts
        if (Array.isArray(data.strength)) {
            data.strength.forEach(workout => {
                const li = document.createElement('li');
                li.textContent = workout;
                strengthList.appendChild(li);
            });
        }
    }
});