import './home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <section>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/cliente">Abra sua conta</Link>
            <Link to="/login">Entrar</Link>
          </nav>
        </header>

        <div className='main'>
          <div className='section'>
            <h1>Plante hoje, colha amanhã</h1>
            <Link to="/cliente">Quero ser MangosBank</Link>
          </div>
        </div>
      </section>

      <section>
        <Link to="/cliente" target="_blank">
          Seja um Mangos Client
        </Link>
      </section>
    </>
  );
}

export default Home;