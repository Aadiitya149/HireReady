// src/App.js

import "./App.css";
import { NavbarComponent } from "./components/Navbar";
import MockInterview from "./components/MockInterview";
import { ClerkProvider } from "@clerk/nextjs";

function App() {
  return (
    <ClerkProvider>
      <div className="App">
        <NavbarComponent />
        <main className="container mx-auto mt-16 p-4">
          <MockInterview />
        </main>
      </div>
    </ClerkProvider>
  );
}

export default App;
