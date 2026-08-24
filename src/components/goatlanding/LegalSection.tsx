import { FadeUp } from "./animations";

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FadeUp>
      <div>
        <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </FadeUp>
  );
}
