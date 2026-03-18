import './home.css';
import { Link } from "react-router-dom";

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
            <h1>Plante hoje, colha amanhã</h1>
          </div>
        </div>
      </section>

      <section>
        <Link to="./dashboard" target="blank">
          Seja um Mangos Client
        </Link>
      </section>
    </>
  );
}

export default Home;