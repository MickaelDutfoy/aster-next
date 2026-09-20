export const TextWithLinks = ({ text }: { text: string | null }) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return (
    <>
      {text.split(urlRegex).map((part, index) => {
        if (!part.match(urlRegex)) {
          return part;
        }

        try {
          const url = new URL(part);

          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return part;
          }

          return (
            <a
              className="link"
              key={index}
              href={url.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {part}
            </a>
          );
        } catch {
          return part;
        }
      })}
    </>
  );
};
