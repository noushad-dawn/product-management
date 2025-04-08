import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductManagement from './components/ProductManagement';
import ProductList from './components/ProductList';
import ProcessManager from './components/ProcessManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 px-4">
        <Routes>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/process-management" element={<ProcessManager />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
