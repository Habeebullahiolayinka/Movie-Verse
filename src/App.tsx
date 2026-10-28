import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Home/home"
import SignUp from "./pages/auth/signUp"
import Login from "./pages/auth/login"
import Forgort from "./pages/auth/forgotPassword"
import { Toaster } from "sonner"
import Series from "./pages/Home/series"
import Movies from "./pages/Home/movies"
import MovieDetail from "./pages/Home/movieDetail"
import SearchPage from "./pages/Home/searchPage"
import SeriesDetail from "./pages/Home/seriesDetail"
import ProtectedRoute from "./component/protectedRotes";
import Favorites from "./pages/Home/favorites";
import PassportPage from "./pages/Home/passportPage";

function App() {
  return (
    <>

      <Toaster
        theme="dark"
        position="top-center"
        style={
          {
            "--normal-bg": "#161922",
            "--normal-text": "#F5F5F5",
            "--normal-border": "#252833",
          } as React.CSSProperties
        }
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<Forgort />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/series/:id" element={<SeriesDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/passport" element={<PassportPage />} />
        </Route>

        <Route path="*" element={<h1 className="p-8 text-ink">Page not found</h1>} />
      </Routes>




    </>

  )
}

export default App
