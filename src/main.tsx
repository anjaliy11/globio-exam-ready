import { createRoot } from 'react-dom/client';
import App from './App';
import Turtle from './Turtle';
import { wake } from './api';
import './styles.css';
wake();
createRoot(document.getElementById('root')!).render(<><App /><Turtle /></>);
