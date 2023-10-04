<!-- Room Inspection App -->
<h1 align="center">Room Inspection App</h1>

<!-- Project Description -->
<p align="center">
  The Room Inspection App is designed to streamline the process of evaluating room status at the African Leadership Academy. This app replaces traditional paperwork used by house heads, making the evaluation results easily accessible to students and providing valuable feedback by highlighting the three areas where students received the lowest scores.
</p>

<p float="center">
  <img src="https://github.com/Kaleab-A/room-inspection/blob/main/sample/photo_2023-10-04_09-11-15.jpg?raw=true)" width=32% />
  <img src="https://github.com/Kaleab-A/room-inspection/blob/main/sample/photo_2023-10-04_09-11-12.jpg?raw=true)" width=32%/> 
  <img src="https://github.com/Kaleab-A/room-inspection/blob/main/sample/photo_2023-10-04_09-11-13.jpg?raw=true" width=32% />
</p>


<!-- Table of Contents -->
## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)

<!-- Features -->
## Features

- **Feedback**: Offer improvement feedback by highlighting the three lowest-scoring areas.
- **Authentication**: Use Firebase for user authentication.
- **Data Storage**: Store evaluation scores for every student in Firebase.
- **Monthly Reports**: Send monthly reports on overall residential status to relevant administrators.
- **Mobile Accessibility**: Build the project into an Android app for convenient use by house heads.

<!-- Technologies Used -->
## Technologies Used

- **ReactJS**: Frontend development.
- **Firebase**: Authentication and data storage.
- **EmailJS**: Sending monthly reports.
- **Android**: Mobile app development.

<!-- Getting Started -->
## Getting Started

To get the Room Inspection App up and running on your local machine, follow these steps:

1. **Clone the Repository**:
   - Clone this repository to your local machine using the following command:
     ```
     git clone https://github.com/Kaleab-A/room-inspection.git
     ```

2. **Install Dependencies**:
   - Navigate to the project directory.
   - Install project dependencies by running:
     ```
     npm install
     ```

3. **Configure Firebase**:
   - Set up a Firebase project and configure the app with Firebase credentials.
   - Update the Firebase configuration in the project.

4. **Run the App**:
   - Start the app by running:
     ```
     npm start
     ```

5. **Access the App**:
   - Open your web browser and visit `http://localhost:3000` to access the Room Inspection App.

<!-- How It Works -->
## How It Works

The Room Inspection App simplifies the room evaluation process by automating the following steps:

1. House heads log in to the app using Firebase authentication.
2. They perform room inspections for a student and input scores for each criterion based on the rubric.
3. The app calculates the overall score for the student and stores it in Firebase.
4. Monthly reports on overall residential status are generated and sent to relevant administrators.
5. Students can access their evaluation results, including feedback on areas for improvement.

<hr/>
Feel free to explore and use the Room Inspection App!
</p>
