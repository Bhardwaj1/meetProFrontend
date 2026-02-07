import Drawer from "../../components/Drawer/Drawer";
import DrawerHeader from "../../components/Drawer/DrawerHeader";
import StatusPill from "../../components/StatusPill";

const MeetingDetailsDrawer = ({ open, onClose, meeting }) => {
  if (!meeting) return null;

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerHeader title={`Meeting ${meeting.id}`} onClose={onClose} />

      <div className="p-5 space-y-4 text-sm text-white">
        <Info label="Host" value={meeting.host} />
        <Info label="Start Time" value={meeting.start} />
        <Info label="End Time" value={meeting.end} />
        <Info label="Duration" value={meeting.duration} />
        <Info label="Participants" value={meeting.users} />

        <div className="flex items-center justify-between">
          <span className="text-white/60">Status</span>
          <StatusPill status={meeting.status} />
        </div>

        {/* Future extension */}
        <div className="pt-4 border-t border-white/10 text-white/50">
          Participant timeline, join/leave logs coming soon…
        </div>
      </div>
    </Drawer>
  );
};

const Info = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-white/60">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default MeetingDetailsDrawer;
