import { Nav } from "react-bootstrap";

export default function FeatureTab() {
  return (
    <div>
      <Nav variant="tabs" defaultActiveKey="/trip">
        <Nav.Item>
          <Nav.Link className="mapTab" href="/home">
            Map
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="FavTab" eventKey="link-1">
            Favourite
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="RouteTab" eventKey="link-2">
            Route
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="ExpenseTab" eventKey="link-2">
            Expense
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
