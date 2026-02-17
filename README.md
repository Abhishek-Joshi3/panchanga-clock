# 🕉️ Vedic 3D Panchang Clock

<img width="500" height="500" alt="Panchang Clock" src="https://github.com/user-attachments/assets/5820c511-c3d0-42ef-8048-ff96e74cd3c7" />

> **"Time is not just a number; it is a cosmic coordinate."**

A high-fidelity, interactive **3D Astrolabe** that visualizes real-time Vedic astrology data. Built for astrologers, developers, and cosmic enthusiasts, this application renders the positions of the Sun (Surya), Moon (Chandra), Nakshatras, and Zodiacs in a "Royal Compass" interface using **React Three Fiber**.

## ✨ Features

* **Real-Time Geocentric Model:** Displays the correct Sidereal (Vedic) position of the Sun and Moon.
* **3D Interactive Interface:**
    * **Zoom & Pan:** Explore the cosmic dial with intuitive controls.
    * **Orthographic View:** A distortion-free "Map Mode" for precise reading.
    * **Royal Theme:** A premium Gold & Navy Blue aesthetic inspired by ancient navigational instruments.
* **Dynamic Panchang Dashboard:**
    * **Tithi Calculation:** Automatically calculates the lunar day (e.g., Shukla Navami).
    * **Nakshatra Tracking:** Highlights the current Nakshatra (Lunar Mansion).
    * **Solar Cycle:** Shows Sunrise, Sunset, and Day Duration based on your location.
* **Mobile First Design:** Fully responsive UI with a floating "Glassmorphism" HUD.

## 🚀 Live Demo
[Link to your Vercel/Netlify deployment]

## 🛠️ Tech Stack

* **Core:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **3D Engine:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
* **Helpers:** [@react-three/drei](https://github.com/pmndrs/drei) (Text, OrbitControls)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Astronomy Logic:** Custom internal algorithm for Sidereal Ayanamsa correction.

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/vedic-astro-clock.git](https://github.com/your-username/vedic-astro-clock.git)
    cd vedic-astro-clock
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run local development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Visit `http://localhost:5173` to see the stars align!

## 🧮 How It Works (The Math)

This project uses a custom calculation engine to convert **Tropical** positions to **Sidereal (Vedic)** positions.

* **Ayanamsa Correction:** We apply a correction of approx. **~24°** (Lahiri Ayanamsa) to the Western longitude.
    * `Sidereal Longitude = (Tropical Longitude - 24°) % 360`
* **Nakshatra Mapping:** The 360° zodiac is divided into 27 sectors of **13°20'** each.
    * `Nakshatra Index = Floor(Sidereal Moon Longitude / 13.33)`

## 🤝 Contributing

We welcome contributions! Whether you want to add planetary orbits, improve the textures, or refine the calculation logic:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🔮 Roadmap

- [ ] Add all 9 Planets (Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- [ ] Integration with a professional Ephemeris API (Swiss Ephemeris)
- [ ] "Time Travel" mode (Select any date in the past/future)
- [ ] Export chart as PDF/Image

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Created with ❤️ by Abhishek*
