import './App.css';
import { NavbarComponent } from './components/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
function App() {
  return (<ClerkProvider>
    <div className="App">
      <NavbarComponent />
    </div>
    </ClerkProvider>
  );
}

export default App;
