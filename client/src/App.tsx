import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Library from "./pages/Library";
import PlantDetail from "./pages/PlantDetail";
import Capture from "./pages/Capture";
import MyCards from "./pages/MyCards";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SharedCard from "./pages/SharedCard";
import Explore from "./pages/Explore";
import Journal from "./pages/Journal";
import Community from "./pages/Community";
import HealthProfile from "./pages/HealthProfile";
import Disclaimer from "./pages/Disclaimer";
import CardsGallery from "./pages/CardsGallery";
import SubmitFolklore from "./pages/SubmitFolklore";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import ModerationPolicy from "./pages/ModerationPolicy";
import MyGarden from "./pages/MyGarden";
import CookieConsent from "./components/CookieConsent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={Library} />
      <Route path="/explore" component={Explore} />
      <Route path="/plant/:id">
        {(params) => <PlantDetail id={params.id} />}
      </Route>
      <Route path="/cards" component={CardsGallery} />
      <Route path="/capture" component={Capture} />
      <Route path="/my-cards" component={MyCards} />
      <Route path="/my-garden" component={MyGarden} />
      <Route path="/journal" component={Journal} />
      <Route path="/community" component={Community} />
      <Route path="/profile" component={Profile} />
      <Route path="/health-profile" component={HealthProfile} />
      <Route path="/admin" component={Admin} />
      <Route path="/shared/:slug">
        {(params) => <SharedCard slug={params.slug} />}
      </Route>
      <Route path="/submit-folklore" component={SubmitFolklore} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/affiliate-disclosure" component={AffiliateDisclosure} />
      <Route path="/community-guidelines" component={CommunityGuidelines} />
      <Route path="/moderation-policy" component={ModerationPolicy} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CookieConsent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
