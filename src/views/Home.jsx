import Layout from "../components/Layout";
import PanelCategorias from "../components/PanelCategorias/PanelCategorias.jsx";
import Banner from "../components/Banner/Banner.jsx"

export default function Home() {
  return (
    <Layout>
        <Banner />
        <PanelCategorias />
    </Layout>
  );
}