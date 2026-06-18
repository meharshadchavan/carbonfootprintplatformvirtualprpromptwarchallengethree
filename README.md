# CarbonWise — Carbon Footprint Platform

**Built for PromptWars: Virtual Challenge 3**

CarbonWise is a sleek, modern, and highly interactive web application designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Core Features

*   **Interactive Carbon Calculator:** A multi-step engine that precisely estimates an individual's carbon footprint based on transportation, energy usage, diet, and lifestyle choices using standard EPA/IPCC emission factors.
*   **Dual Translation Engine:** Built-in multilingual support for English, Hindi, Marathi, Spanish, and French. Switch languages instantly without page reloads.
*   **Intent-Driven Voice Engine:** Features a command bar powered by the native Web Speech API. Use voice commands (like "I drive electric" or "Show my dashboard") to seamlessly navigate the application.
*   **Speech Synthesis:** Click "Read Results Out Loud" on the dashboard to hear your carbon footprint summary spoken back to you in your selected language.
*   **Gamification & Actions:** Receive personalized recommendations to reduce your impact. Complete actions to earn points, level up, and unlock achievement badges.
*   **Premium Glassmorphism UI:** A sleek dark-mode design system featuring smooth gradients, dynamic animated orbs, responsive layouts, and highly interactive components.
*   **Accessibility First:** Designed with ARIA labels, semantic HTML, and robust focus states ensuring seamless keyboard navigation.

## Architecture

CarbonWise is built as a highly optimized, dependency-free Single Page Application (SPA).

*   **Frontend Technologies:** Vanilla HTML5, CSS3, and JavaScript. No bulky frameworks (like React or Vue) are required, resulting in a lightning-fast load time and minimal browser overhead.
*   **State Management:** An internal reactive state object handles user inputs and points. Data is persisted to the browser's `localStorage`.
*   **DOM Updates:** Render functions dynamically update the UI utilizing secure methods (`textContent`, element creation) to prevent XSS vulnerabilities.
*   **Responsive Design:** Utilizes CSS Flexbox and CSS Grid to ensure an optimal viewing experience across mobile, tablet, and desktop devices.
*   **Voice/Speech:** Integrates `webkitSpeechRecognition` for speech-to-text intents and `SpeechSynthesisUtterance` for text-to-speech output.

## Comprehensive Testing

CarbonWise includes a powerful, built-in developer testing suite capable of verifying complex logical permutations.

1.  **Automated 100-Case Runner:** Accessible via the "Dev Test Suite" toggle in the bottom right corner of the application.
2.  **Scenario Generation:** The suite dynamically generates 100 randomized lifestyle profiles (e.g., mixing heavy-meat diets, electric vehicles, large homes, and varying flight frequencies).
3.  **Assertions:**
    *   Validates that no emission category results in negative carbon output.
    *   Ensures that calculation totals are finite numbers (Not NaN).
    *   Verifies that the sum of individual sub-categories precisely matches the aggregated total (accounting for floating-point precision).
4.  **Logging:** Results are immediately outputted to a data table within the UI for easy validation.

## Setup and Local Development

Since CarbonWise is a static application, setting it up for local development is incredibly simple.

### Prerequisites
*   A modern web browser (Google Chrome or Microsoft Edge recommended for full Voice API support).
*   Any standard local web server (e.g., VS Code Live Server, Python HTTP server, Node `http-server`).

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/[your-username]/carbon-footprint-platform.git
    cd carbon-footprint-platform
    ```
2.  Start a local server. For example, using Python:
    ```bash
    python -m http.server 8000
    ```
    *Alternatively, use the "Live Server" extension in VS Code.*
3.  Open your browser and navigate to `http://localhost:8000`.

