import { ImageResponse } from '@vercel/og';
import type { NextApiRequest } from 'next';

import type { QueryIdea } from 'pages/api/ideas/[id]';
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

const avatarSize = 48;
const anonymousImg = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgray',
      borderRadius: '2px',
      width: `${avatarSize}px`,
      minWidth: `${avatarSize}px`,
      height: `${avatarSize}px`,
      minHeight: `${avatarSize}px`,
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
  const { idea } = (await response.json()) as { idea: QueryIdea };

  if (!idea) {
    return new ImageResponse(fallbackImg, fallbackConf);
  }

  const { title, tagLine, summary, votes, _count } = idea;
  const description = tagLine ?? summary.split('. ').slice(0, 2).join('. ') + '.';
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
              borderRadius: '2px',
              width: `${avatarSize}px`,
              height: `${avatarSize}px`,
            }}
            src={author.image!}
            alt={author.name!}
          />
        </RenderIf>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 64px 0 24px' }}>
          <h4 style={{ margin: '0' }}>{author.name}</h4>
          <h1 style={{ marginTop: '0px', fontSize: '48px' }}>{title}</h1>
          <span>{description}</span>
          <div
            style={{
              marginTop: 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
            }}
          >
            <span>
              Votes:
              {' '}
              {votes}
            </span>
            <span>
              Comments:
              {' '}
              {_count.comments}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 300,
    },
  );
}
