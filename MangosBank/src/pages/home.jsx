import './home.css';
<<<<<<< HEAD
import backgroundImage from '../assets/images.jpg';
import { Link } from 'react-router-dom';
=======
import { Link } from "react-router-dom";
>>>>>>> 4111010dab1b879c881190eb64cec7c0b2033944

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
<<<<<<< HEAD
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
=======
      <section>
        <header>
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/login">Entrar</Link>
          </nav>
        </header>

        <div className='main'>
          <div className='section'>
            <h1>Plante hoje, colha amanhã</h1>
          </div>
        </div>
      </section>

      <section>
        <Link to="./dashboard" target="blank">
          Seja um Mangos Client
        </Link>
      </section>
>>>>>>> 4111010dab1b879c881190eb64cec7c0b2033944
    </>
  );
}

export default Home;