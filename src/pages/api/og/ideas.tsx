import { ImageResponse } from '@vercel/og';
import type { NextApiRequest } from 'next';

import RenderIf from 'components/RenderIf';

export const config = {
  runtime: 'experimental-edge',
};

const fallbackImg = (
  <div
    style={{
      fontSize: 128,
      background: 'white',
      width: '100%',
      height: '100%',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    No Idea found!
  </div>
);

const fallbackConf = {
  width: 1200,
  height: 600,
};

const anonymousImg = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgray',
      borderRadius: '4px',
      width: '64px',
      height: '64px',
    }}
  >
    A/N
  </div>
);

export default async function buildOGImageForIdea(req: NextApiRequest) {
  const { origin, searchParams } = new URL(req.url!);

  if (!searchParams.has('id')) {
    return new ImageResponse(fallbackImg, fallbackConf);
  }

  const response = await fetch(`${origin}/api/ideas/${searchParams.get('id')}`);
  const { idea } = await response.json();

  if (!idea) {
    return new ImageResponse(fallbackImg, fallbackConf);
  }

  console.log('OG idea', idea);

  const { title, summary } = idea;
  const author = idea.author ?? { name: 'Anonymous', image: null };

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '48px',
        }}
      >
        <RenderIf
          condition={!!author.image}
          fallback={anonymousImg}
        >
          <img
            style={{
              borderRadius: '4px',
              width: '64px',
              height: '64px',
            }}
            src={author.image!}
            alt={author.name!}
          />
        </RenderIf>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 64px 0 24px' }}>
          <h4 style={{ margin: '0' }}>{author.name}</h4>
          <h1 style={{ marginTop: '0px', fontSize: '48px' }}>{title}</h1>
          <span>{summary}</span>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  );
}
