import { useContext } from "react";
import { MeetingContext } from "./MeetingContext";

export const useMeeting = () => useContext(MeetingContext);
