import { dividerClasses } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../../css/NewEvent.css";

interface newEventModalProps {
  isShown: boolean;
  name: string;
  address: string;
  business_hours: string[] | null;
  phone: string | null;
  website: string | null;
  onHide: () => void;
  onSubmit: () => void;
}

export function NewEventModal(props: newEventModalProps) {
  return (
    <Modal
      show={props.isShown}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add to your trip plan</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <Form>
            <div className="place_name">{props.name}</div>
            <Form.Group className="mb-3" >
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" placeholder="Example: Food, Lodging" />
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" placeholder="DD/MM/YY" />
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Time</Form.Label>
              <Form.Control type="text" placeholder="booked for 9:00pm" />
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Address</Form.Label>
             <div>{props.address}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Business Hours</Form.Label>
              {props.business_hours ? (
                <div>
                  {props.business_hours?.map((hours: string) => (
                    <div>{hours}</div>
                  ))}
                </div>
              ) : (
                <Form.Control
                  as="textarea"
                  rows={7}
                  type="text"
                  placeholder=""
                ></Form.Control>
              )}
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Phone No. </Form.Label>
              {props.phone ? (
                <div>{props.phone}</div>
              ) : (
                <Form.Control type="text" placeholder=""></Form.Control>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website </Form.Label>
              {props.website ? (
                <div><a href={props.website} target="_blank">
                {props.website}
              </a></div>
              ) : (
                <Form.Control type="website" placeholder=""></Form.Control>
              )}
            </Form.Group>

          
            <Form.Group className="mb-3" >
              <Form.Label>Budget($)</Form.Label>
              <Form.Control type="text" placeholder="100" />
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Expense($)</Form.Label>
              <Form.Control type="text" placeholder="100" />
            </Form.Group>

          </Form>
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={props.onSubmit}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
