import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AppDataProvider } from "./contexts/AppDataContext";
import { useClubStore } from "./stores/clubStore";
import OnboardingScreen1 from "./screens/OnboardingScreen1";
import OnboardingScreen2 from "./screens/OnboardingScreen2";
import OnboardingScreen3 from "./screens/OnboardingScreen3";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ClubConnectionScreen from "./screens/ClubConnectionScreen";
import ClubDashboard from "./screens/ClubDashboard";
import AthleteDashboard from "./screens/AthleteDashboard";

type UserRole = "CLUB_OWNER" | "CLUB_ADMIN" | "ATHLETE" | null;

function App() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [needsClubConnection, setNeedsClubConnection] = useState(false);

  useEffect(() => {
    const onboarding = localStorage.getItem("hasSeenOnboarding");
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole") as UserRole;
    const needsConnection = localStorage.getItem("needsClubConnection");

    if (onboarding === "true") setHasSeenOnboarding(true);
    if (auth === "true") setIsAuthenticated(true);
    if (role) setUserRole(role);
    if (needsConnection === "true") setNeedsClubConnection(true);
  }, []);

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const handleLogin = (role: UserRole, needsConnection: boolean) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // CLUB_OWNER nunca passa pela tela de conexão por código (decisão de fluxo).
    const needsConn = needsConnection && role !== "CLUB_OWNER";
    setNeedsClubConnection(needsConn);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role || "");
    localStorage.setItem("needsClubConnection", needsConn ? "true" : "false");
  };

  const handleRegister = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === "CLUB_OWNER") {
      setNeedsClubConnection(false);
      localStorage.setItem("needsClubConnection", "false");
    } else {
      setNeedsClubConnection(true);
      localStorage.setItem("needsClubConnection", "true");
    }
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role || "");
  };

  const handleClubConnection = () => {
    setNeedsClubConnection(false);
    localStorage.setItem("needsClubConnection", "false");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setNeedsClubConnection(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("needsClubConnection");
    // Limpa o estado de autenticação persistido no clubStore (Zustand)
    useClubStore.getState().logout();
  };

  return (
    <AppDataProvider>
      <Router>
        <Routes>
          {!hasSeenOnboarding ? (
            <>
              <Route path="/onboarding-1" element={<OnboardingScreen1 onComplete={completeOnboarding} />} />
              <Route path="/onboarding-2" element={<OnboardingScreen2 onComplete={completeOnboarding} />} />
              <Route path="/onboarding-3" element={<OnboardingScreen3 onComplete={completeOnboarding} />} />
              <Route path="*" element={<Navigate to="/onboarding-1" replace />} />
            </>
          ) : !isAuthenticated ? (
            <>
              <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterScreen onRegister={handleRegister} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : needsClubConnection ? (
            <>
              <Route path="/club-connection" element={<ClubConnectionScreen onConnect={handleClubConnection} />} />
              <Route path="*" element={<Navigate to="/club-connection" replace />} />
            </>
          ) : (
            <>
              {userRole === "CLUB_OWNER" || userRole === "CLUB_ADMIN" ? (
                <Route path="/dashboard/*" element={<ClubDashboard onLogout={handleLogout} />} />
              ) : (
                <Route path="/dashboard/*" element={<AthleteDashboard onLogout={handleLogout} />} />
              )}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </AppDataProvider>
  );
}

export default App;