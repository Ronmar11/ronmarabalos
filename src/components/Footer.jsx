import { useContent } from '../content/ContentContext.jsx';

export default function Footer() {
  const { settings } = useContent();

  return (
    <footer className="mx-[min(5rem,5%)] flex flex-col items-center justify-center gap-1 border-t-[1.5px] border-[rgba(122,121,121,0.442)] px-[min(3rem,1%)] py-8 text-center font-mono">
      <p className="text-sm">{settings.footer_text}</p>
    </footer>
  );
}
