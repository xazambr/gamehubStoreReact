import Footer from './Footer/Footer.jsx'
import Header from './Header/Header.jsx'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="content d-flex flex-column min-vh-100">{children}</div>
      <Footer />
    </>
  )
}