import './home.css';
import backgroundImage from '../assets/images.jpg';
import { Link } from 'react-router-dom';

function Home() {

// imagem de fundo

const styleBackgroundImg = {
  backgroundImage: "url(${/assets/images.jpg})",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100dvh',
  width: '100%',
};

  return (
    <>
      <div className='body'>
        <div className='header'>
          <Link className='headerLink' to="/">Home</Link>
          <div className='nav'>
            <Link className='headerLink' to="/cliente">Abra sua conta</Link>
            <Link className='headerLink' to="/login">Entrar</Link>
          </div>
        </div>
        <div className='main'>
          <div className='section'>
            <h1>Plante hoje, colha amanhã</h1>
            <Link className='clienteLink' to="/cliente" target="_blank">
              Quero ser Mangos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;