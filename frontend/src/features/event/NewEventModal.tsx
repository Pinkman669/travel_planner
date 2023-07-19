import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../../css/NewEvent.css";
import { queryClient } from "../..";
import { useMutation } from "@tanstack/react-query";
import { NewEventItem, addNewEvent } from "./EventAPI";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import { notify } from "../utils/utils";
import { fetchEventByTrip } from "./newEventSlice";

interface newEventModalProps {
  isShown: boolean;
  name: string;
  address: string;
  business_hours: string[] | null;
  phone: string | null;
  website: string | null;
  onHide: () => void;
}

export interface LocationInfo{
  name: string;
  address: string;
  businessHours: string[] | null;
  phone: string | null;
  website: string | null;
}

export function NewEventModal(props: newEventModalProps) {
  const dispatch = useAppDispatch()
  const placeId = useAppSelector((state) => state.place.placeId);
  const { tripId } = useParams();
  const datesOfTrip = useAppSelector(state => state.trip.tripItems).find((trip) => trip.id === Number(tripId))?.DatesOfTrip
  const tripInfo = useAppSelector((state) =>
    state.trip.tripItems.find((item) => item.id === Number(tripId))
  );
  const startDate = tripInfo?.start_date;
  const endDate = tripInfo?.end_date


  const { register, handleSubmit } = useForm<NewEventItem>({
    defaultValues: {
      name: "",
      date: new Date(),
      time: "",
      location: "",
      business_hours: [],
      phone: "",
      website: "",
      budget: Number(),
      expense: Number(),
      category: "",
      item_order: 1,
    },
  });

  const onSubmit = useMutation(
    async (data: NewEventItem) => {
      if (placeId && startDate && tripId) {
        const locationInfo = {
          name: props.name,
          address: props.address,
          businessHours: props.business_hours,
          phone: props.phone,
          website: props.website
        }
        return await addNewEvent(data, placeId, startDate, endDate as Date, tripId,locationInfo);
      }
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["tripItems"]);
        notify(true, "Added new event");
      },
      onError: (error) => {
        notify(false, "Add new event fail" + error);
      },
      onSettled: () => dispatch(fetchEventByTrip({tripId: Number(tripId), datesOfTrip: datesOfTrip || []}))
    }
  );

  async function submit(data: NewEventItem) {
    onSubmit.mutate(data);
  }
  console.log(props)
  const hours = props.business_hours?.join("\n");

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
        <Form onSubmit={handleSubmit(submit)}>
          <Form.Group className="mb-3 autoFill">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              {...register("name")}
              value={props.name}
              placeholder={props.name}
              readOnly
              plaintext
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Example: Food, Lodging"
              {...register("category")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="DD/MM/YY"
              {...register("date")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="text"
              placeholder="booked for 9:00pm"
              {...register("time")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.address}
              value={props.address}
              {...register("location")}
              readOnly
              plaintext
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Business Hours</Form.Label>
            {props.business_hours ? (
              <Form.Control
                as="textarea"
                rows={7}
                type="text"
                placeholder={hours}
                value={props.business_hours}
                {...register("business_hours")}
                readOnly
                plaintext
              ></Form.Control>
            ) : (
              <Form.Control
                as="textarea"
                rows={7}
                type="text"
                placeholder=""
                {...register("business_hours")}
              ></Form.Control>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone No. </Form.Label>
            {props.phone ? (
              <Form.Control
                type="text"
                placeholder={props.phone}
                value={props.phone}
                {...register("phone")}
                readOnly
                plaintext
              />
            ) : (
              <Form.Control type="text" placeholder=""></Form.Control>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Website </Form.Label>
            {props.website ? (
              <Form.Control
                type="text"
                placeholder={props.website}
                value={props.website}
                {...register("website")}
                readOnly
                plaintext
              />
            ) : (
              <Form.Control type="website" placeholder=""></Form.Control>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Budget($)</Form.Label>
            <Form.Control
              type="text"
              placeholder="100"
              {...register("budget")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expense($)</Form.Label>
            <Form.Control
              type="text"
              placeholder="100"
              {...register("expense")}
            />
          </Form.Group>

          <Button variant="secondary" onClick={props.onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={props.onHide}>
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
