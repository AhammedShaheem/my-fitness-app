from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Mock database of workouts based on a simple classification
WORKOUT_DATABASE = {
    'beginner': {
        'cardio': ['Brisk Walking', 'Elliptical (20 min)', 'Cycling'],
        'strength': ['Bodyweight Squats', 'Push-ups (on knees)', 'Plank (30 sec)']
    },
    'intermediate': {
        'cardio': ['Running (30 min)', 'Jump Rope', 'HIIT Sprints'],
        'strength': ['Dumbbell Curls', 'Pull-ups (assisted)', 'Bench Press']
    },
    'advanced': {
        'cardio': ['Marathon Training', 'High-Intensity Sprints', 'Swimming Laps'],
        'strength': ['Deadlifts', 'Weighted Pull-ups', 'Heavy Squats']
    }
}

def get_fitness_level(age, weight):
    """
    Determines a user's fitness level based on simple age and weight criteria.
    This is a simplified example and not a medical recommendation.
    """
    if age < 25 and weight < 80:
        return 'advanced'
    elif age < 40 and weight < 100:
        return 'intermediate'
    else:
        return 'beginner'

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend_workouts():
    """
    Receives user data and returns a JSON response with workout recommendations.
    """
    try:
        data = request.get_json()
        age = data.get('age')
        weight = data.get('weight')

        if not all([age, weight]):
            return jsonify({'error': 'Age and weight are required.'}), 400

        level = get_fitness_level(age, weight)
        recommendations = WORKOUT_DATABASE.get(level, {})

        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

