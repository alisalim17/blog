import { PostSnippetFragment } from '@/generated/graphql';
import ArrowLink from '@/ui/links/ArrowLink';
import PrimaryLink from '@/ui/links/PrimaryLink';
import UnstyledLink from '@/ui/links/UnstyledLink';
import { useGetVideoId } from '@/utils/useGetVideoId';
import React from 'react';

//sidebar post
const Post: React.FC<PostSnippetFragment> = ({
  title,
  url,
  id,
  description,
}) => {
  const videoUrl = useGetVideoId(url);
  const postURL = `/p/${id}`;

  return (
    <li className='mt-2 flex items-center'>
      <UnstyledLink href={postURL}>
        <div className='relative grid  grid-cols-6 gap-3'>
          <div className='col-span-2'>
            {/* @todo use next image  */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`http://i.ytimg.com/vi/${videoUrl}/mqdefault.jpg`}
              alt={`Post - ${title}`}
              title={title}
            />
          </div>
          <div className='col-span-4 flex flex-col'>
            <h4 className='font-medium  text-primary-700'>{title}</h4>
            {/* @todo add description */}
            <p className='text-sm font-normal text-gray-700'>
              {description.slice(0, 48)}
              <ArrowLink
                as={PrimaryLink}
                className='inline-flex items-center font-normal'
                href={postURL}
              >
                ...Go to post
              </ArrowLink>
            </p>
            <span className='mt-2 text-sm font-light text-gray-400'>
              200k Views
            </span>
          </div>
        </div>
      </UnstyledLink>
    </li>
  );
};
export default Post;