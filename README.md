# GeoGuesser

GeoGuesser is an interactive, multiplayer geography game where players guess locations based on visual clues. Built with React and Socket.IO, it offers a fun and engaging way to test and improve your geographical knowledge.

## Features

- Real-time multiplayer gameplay
- Custom game lobbies with shareable codes
- Chat functionality within game lobbies
- Customizable game settings (location type, region, time limit, rounds, movement allowance)
- Interactive 3D starry background
- Responsive design for various screen sizes

## Technologies Used

- React
- Node.js
- Express
- Socket.IO
- Three.js
- Styled Components
- Framer Motion

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/geoguesser.git
   cd geoguesser
   ```

2. Install the dependencies for both the client and server:
   ```
   npm install
   cd server
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory and add any necessary environment variables.

## Running the Application

1. Start the server:
   ```
   cd server
   node server.js
   ```

2. In a new terminal, start the React app:
   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Game Rules

1. Create a profile or join as a guest
2. Host a new game or join an existing one with a game code
3. Wait for all players to join in the lobby
4. The host can start the game when ready
5. Each round, players are shown a location and must guess where it is on the map
6. Points are awarded based on the accuracy of the guess and the time taken
7. The player with the most points at the end of all rounds wins

## Contributing

Contributions to GeoGuesser are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [Three.js](https://threejs.org/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/geoguesser](https://github.com/yourusername/geoguesser)