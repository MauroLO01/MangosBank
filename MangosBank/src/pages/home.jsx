import './home.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/icon-logo2.png';
import linkPlayStore from '../assets/playstore.png';
import arrowLinkClient from '../assets/arrow-right2.png';
import linkAppleStore from '../assets/apple-store.png'; 


function Home() {

  return (
    <>
      <section>
        <header>
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/login">Entrar</Link>
          </nav>
        </header>

        <div className='main'>
          <div className='section'>
            <img className='logoH1' src={Logo} alt="Logo" />
            <h1 className='slogan'>Plante hoje, colha amanhã</h1>
            <Link className='clienteLink' to="/cliente" target="_blank">
              Quero ser Mangos <img src={arrowLinkClient} alt="Seta" />
            </Link>
          </div>
        </div>
        <div className="footer">
          <p className="copy">© 2026 MangosBank. Todos os direitos reservados.</p>
          <div className="linkStores">
          <p>Baixe o nosso App</p>
            <div className="linkAppStores">
              <a href="https://play.google.com" target="_blank"><img src={linkPlayStore} alt="Play Store" srcset="" /></a>
              <a href="https://apps.apple.com" target="_blank"><img src={linkAppleStore} alt="Apple Store" srcset="" /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;