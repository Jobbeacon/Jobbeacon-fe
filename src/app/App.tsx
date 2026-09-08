import { BrowserRouter } from 'react-router-dom'
import Header from '../shared/components/navigation/header/Header'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
}
