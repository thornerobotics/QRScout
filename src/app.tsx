import { useEffect } from 'preact/hooks';
import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { QueuePage } from './components/QueuePage';
import { Sections } from './components/Sections';
import { CommitAndResetSection } from './components/Sections/CommitAndResetSection/CommitAndResetSection';
import { ConfigSection } from './components/Sections/ConfigSection';
import {
  resetToDefaultConfig,
  resetToPitConfig,
  saveToQueue,
  useQRScoutState,
} from './store/store';

function ScoutingForm() {
  const formData = useQRScoutState(state => state.formData);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="font-sans text-5xl font-bold">
        <div className={`font-rhr text-red-rhr`}>{formData.page_title}</div>
      </h1>

      <form className="w-full px-4" onSubmit={e => e.preventDefault()}>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Sections />
          <CommitAndResetSection onCommit={() => saveToQueue()} />
          <ConfigSection />
        </div>
      </form>
    </main>
  );
}

function MatchScout() {
  useEffect(() => {
    resetToDefaultConfig();
  }, []);

  return <ScoutingForm />;
}

function PitScout() {
  useEffect(() => {
    resetToPitConfig();
  }, []);

  return <ScoutingForm />;
}

export function App() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-800 bg-gray-50">
      <Header />
      <div className="flex-1 py-2">
        <Routes>
          <Route path="/" element={<MatchScout />} />
          <Route path="/pit" element={<PitScout />} />
          <Route path="/queue" element={<QueuePage />} />
        </Routes>
      </div>
      <Navbar />
      <Footer />
    </div>
  );
}
