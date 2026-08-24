import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

// TODO: placeholder até existir um endpoint real de série histórica de
// detecções/eventos por dia. Os valores abaixo são sempre zero de propósito
// (não inventa volume que não aconteceu).
const days = [
  "11/05",
  "12/05",
  "13/05",
  "14/05",
  "15/05",
  "16/05",
  "17/05",
  "18/05",
  "19/05",
  "20/05",
  "21/05",
  "22/05",
  "23/05",
  "24/05",
  "25/05",
  "26/05",
  "27/05",
  "28/05",
  "29/05",
  "30/05",
  "31/05",
  "01/06",
  "02/06",
  "03/06",
  "04/06",
  "05/06",
  "06/06",
  "07/06",
  "08/06",
  "09/06",
  "10/06",
];

const data = days.map((d) => ({ d, deteccoes: 0, eventos: 0 }));
const ticks = days.filter((_, i) => i % 2 === 0);

export function VolumeChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid stroke="var(--hairline)" vertical={false} />
          <XAxis
            dataKey="d"
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            domain={[0, 4]}
            ticks={[0, 1, 2, 3, 4]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            width={32}
          />
          <Area
            type="monotone"
            dataKey="deteccoes"
            stroke="var(--gold)"
            strokeWidth={1.4}
            fill="var(--gold)"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="eventos"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-6 text-[10.5px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-[2px] bg-muted-foreground" /> Eventos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-[2px] bg-gold" /> Detecções
        </span>
      </div>
    </div>
  );
}
