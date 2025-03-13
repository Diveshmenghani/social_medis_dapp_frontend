import { StateContextProvider } from './context/index';
import { routes } from './component/footer';
import { RouterProvider } from 'react-router-dom';
import Header from './component/header';
import { Toaster } from "react-hot-toast";
import './App.css'
function App() {
  return (
  <>
   <div className="flex flex-col min-h-screen p-6">
  <StateContextProvider>
  <Toaster position="top-center" reverseOrder={false} />
  <Header/>
  <main className="items-center text-center justify-between flex-1">
  <RouterProvider router={routes}></RouterProvider>
  </main>
  </StateContextProvider>
  </div>
  </>
  )
}

export default App
