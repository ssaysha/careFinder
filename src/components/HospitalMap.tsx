type Hospital = {
  id: string;
  name: string;
  city: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  hospitals: Hospital[];
};

function HospitalMap({ hospitals }: Props) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border">
      <iframe
        title="map"
        width="100%"
        height="100%"
        src="https://www.openstreetmap.org/export/embed.html?bbox=3.0%2C4.0%2C9.5%2C13.5&layer=mapnik"
      />
    </div>
  );
}

export default HospitalMap;