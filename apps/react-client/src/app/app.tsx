import { Routes, Route } from 'react-router-dom';

import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TicketsPage } from './pages/TicketsPage';
import { Header } from './components/Header';

import styles from './app.module.css';

const App = () => {
  return (
    <div className={styles['app']}>
      <Header />
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/:ticketId" element={<TicketDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
