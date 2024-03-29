import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Cookies from "universal-cookie";
import { useIdleTimer } from "react-idle-timer";

const Navigation = ({ loggedUser, hostname }) => {
  function logOut() {
    const cookies = new Cookies();

    cookies.remove("access_token", { path: "/" });
    cookies.remove("token_type", { path: "/" });
    window.location.href = "/";
  }

  const handleOnIdle = () => {
    if (loggedUser) {
      alert("Budete automaticky odhlásený z dôvodu neaktivity.");
      logOut();
    }
  };

  //5 min idle timer
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    debounce: 500,
  });
  return (
    <>
      <div className=" d-flex justify-content-center m-3">
        <Navbar expand="lg" className="border-bottom" navbar-brand="true">
          <Container>
            <Navbar.Brand href="#home">Fituška 2</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Kurzy</Nav.Link>
                <Nav.Link href="/top">Rebríček</Nav.Link>
                {!loggedUser ? (
                  <>
                    <Nav.Link href="/login">Prihlásanie</Nav.Link>
                    <Nav.Link href="/register">Registrácia</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/profile">Profil</Nav.Link>
                    <Nav.Link onClick={() => logOut()}>Odhlásenie</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default Navigation;
