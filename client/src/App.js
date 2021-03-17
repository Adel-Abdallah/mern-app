import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Container } from "reactstrap";
function App() {
  return (
    <div>
      <Container>
        <Navbar />
        <Route exact path='/' component={Home} />
        <Route path='/login' exact>
          <Login />
        </Route>
      </Container>
    </div>
  );
}

export default App;
