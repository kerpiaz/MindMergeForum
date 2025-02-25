import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const jokes = [
    {
      text: "That page is hiding better than my motivation on Monday mornings. Maybe try looking somewhere that actually exists?",
      icon: "🙈",
    },
    {
      text: "You've been staring at this error page for way too long. That missing content isn't going to find itself, you know.",
      icon: "⏱️",
    },
    {
      text: "Congratulations! You've discovered our secret 404 page. There's no prize. Go do something productive now.",
      icon: "🏆",
    },
    {
      text: "This page has gone to get coffee and never came back. Kind of like my ex. And my dad.",
      icon: "☕",
    },
    {
      text: "If you keep refreshing, this page still won't exist. But hey, at least you're persistent at failing.",
      icon: "🔄",
    },
    {
      text: "Plot twist: You're the one who's not found. This is actually an existential crisis simulator.",
      icon: "🤯",
    },
    {
      text: "The page you're looking for is probably out having a life. Maybe you should try that too?",
      icon: "🏄",
    },
    {
      text: "404: Page not found. Also not found: the point of you sitting here clicking random buttons.",
      icon: "👆",
    },
    {
      text: "This page exists in an alternate universe where you actually finished that project instead of browsing the internet.",
      icon: "🌌",
    },
    {
      text: "You've reached the end of the internet. Congratulations! Your prize is this sarcastic error message.",
      icon: "🎁",
    },
    {
      text: "The content you seek has been deleted to make room for more cat videos. Priorities, you know?",
      icon: "🐱",
    },
    {
      text: "Error 404: Page not found. Error 405: Your productivity not found either.",
      icon: "📉",
    },
  ];

  const navigate = useNavigate(); 
  const [randomJoke, setRandomJoke] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [searchInput, setSearchInput] = useState(""); 

  /**
 * Set a random joke and handles joke cycling
 * 
 * @effect Selects random joke on component mount and applies fade-in animation
 * @function getNewJoke Cycles to a different random joke with transition effect
 */
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setRandomJoke(jokes[randomIndex]);
    setFadeIn(true);
  }, []);

  const getNewJoke = () => {
    setFadeIn(false);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * jokes.length);
      } while (randomJoke && jokes[newIndex].text === randomJoke.text);
      
      setRandomJoke(jokes[newIndex]);
      setFadeIn(true);
    }, 300);
  };

  /**
 * Search functionality handlers
 * 
 * @function handleSearchInputChange Updates search input state
 * @function handleSearch Navigates to forum with search parameters
 * @function handleKeyPress Triggers search on Enter key press
 */
   const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/forum?searchQuery=${encodeURIComponent(searchInput)}&searchCriteria=title`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      handleSearch();
    }
  };


  if (!randomJoke) return null; // Initial loading state

  return (
    <div className="so-not-found-container">
      <div className="so-content-wrapper">
        <div className="so-error-code">
          <span>4</span>
          <span className="so-error-icon" onClick={getNewJoke}>
            {randomJoke.icon}
          </span>
          <span>4</span>
        </div>
        
        <h1 className="so-error-title">Page Not Found</h1>
        
        <div className={`so-error-card ${fadeIn ? "fade-in" : "fade-out"}`}>
          <div className="so-card-content">
            <p className="so-joke-text">{randomJoke.text}</p>
            <button className="so-refresh-joke" onClick={getNewJoke}>
              Give me another sick burn
            </button>
          </div>
        </div>
        
        <div className="so-error-message">
          <p>
            Look, we both know that page does not exist. You can keep refreshing
            for more sassy comments, or you could do something useful with your life.
            Your call.
          </p>
        </div>
        
        <div className="so-navigation">
          <a href="/" className="so-home-button">
            Fine, take me home
          </a>
          <button 
            className="so-back-button"
            onClick={() => window.history.back()}
          >
            Let me escape this sass
          </button>
        </div>
        
        <div className="so-search-section">
          <h2>Still determined to waste time? Search for something:</h2>
          <div className="so-search-box">
            <input 
              type="text" 
              placeholder="Search for content that might actually exist..." 
              className="so-search-input"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyPress}
            />
            <button 
              className="so-search-button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        
        <footer className="so-footer">
          <div className="so-copyright">
            © {new Date().getFullYear()} MindMerge Company. All rights reserved. Including the right to judge your 404 adventures.
          </div>
        </footer>
      </div>
    </div>
  );
}
