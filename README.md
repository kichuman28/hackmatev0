# Hackmate (In Progress)



Hackmate is a platform designed to help college students and hackathon participants connect with teammates based on skills and shared interests. The application allows users to search for and message potential teammates, with a focus on connecting students from the same college or university.

![image](https://github.com/user-attachments/assets/336a26dd-e00d-4085-8236-c55e11de5409)

![image](https://github.com/user-attachments/assets/bc679f89-e38f-499a-9431-fc1ae5fc5607)
![image](https://github.com/user-attachments/assets/b0aeb025-d806-446d-9304-12b8150a7aa6)
![image](https://github.com/user-attachments/assets/5fedd03c-a6d1-4feb-860a-d5a247c3eeab)
![image](https://github.com/user-attachments/assets/f74046a5-81ab-4202-816f-a83967b3fd96)
![image](https://github.com/user-attachments/assets/f9a8cc32-7f7d-4f5d-a109-f1268dd5dfdb)



## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Skill-Based Search**: Users can search for teammates based on specific skills, with results prioritized by college.
- **User Profiles**: Users can create and manage profiles with details such as bio, skills, and social links.
- **Real-Time Messaging**: Firebase-powered chat functionality allows users to communicate instantly.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a seamless user experience on all devices.
- **College-Based Prioritization**: Search results highlight users from the same college for easier connections.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Firebase Authentication and Firestore Database
- **Real-Time Messaging**: Firebase Firestore (for messaging data)
- **Deployment**: Vercel
- **UI Components**: Radix UI, shadcn, Lucide Icons
- **Animations**: Framer Motion

## Installation

### Prerequisites
- **Node.js** (v14 or later) and **npm**
- **Firebase Project**: Set up a Firebase project with Firestore and Authentication enabled.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hackmate.git
   cd hackmate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase by setting up your credentials in the `.env` file (see below).

4. Run the development server:
   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration values:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Usage

- **User Authentication**: Sign up or log in using email and password authentication.
- **Search for Teammates**: Navigate to the dashboard to search for teammates based on skills. 
- **Real-Time Chat**: Use the messaging feature to connect with other users in real-time.
  
## Contributing

Contributions are welcome! If you have ideas for new features or improvements, please open an issue or submit a pull request.

