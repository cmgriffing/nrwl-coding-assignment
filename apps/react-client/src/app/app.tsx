import { Routes, Route } from 'react-router-dom';

import styles from './app.module.css';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TicketsPage } from './pages/TicketsPage';

const App = () => {
  return (
    <div className={styles['app']}>
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/:ticketId" element={<TicketDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
