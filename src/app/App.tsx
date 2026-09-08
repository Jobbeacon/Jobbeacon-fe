import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from '../shared/components/navigation/header/Header'
import HomePage from '../features/home/pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
