import { env } from 'env/client.mjs';

interface Props {
  idea: {
    id: string;
    title: string;
    tagLine: string | null;
    summary: string;
  };
}

export default function HeaderMetas(props: Props) {
  const { idea: { id, title, tagLine, summary } } = props;
  const description = tagLine ?? summary.split('. ').slice(0, 2).join('. ') + '.';
  return (
    <>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${env.NEXT_PUBLIC_DOMAIN}/api/og/ideas?id=${id}`} />
      <meta property="og:url" content={`${env.NEXT_PUBLIC_DOMAIN}/ideas?id=${id}`} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${env.NEXT_PUBLIC_DOMAIN}/api/og/ideas?id=${id}`} />
      <meta name="twitter:alt" content={tagLine ?? summary} />
    </>
  );
}
