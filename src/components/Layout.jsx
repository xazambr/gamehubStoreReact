import Footer from './Footer.jsx'
import Header from './Header/Header.jsx'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="content">{children}</div>
      <Footer />
    </>
  )
}