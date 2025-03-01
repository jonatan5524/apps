import React, { ReactElement, useContext } from 'react';
import { Item } from '@dailydotdev/react-contexify';
import dynamic from 'next/dynamic';
import { QueryClient, QueryKey, useQueryClient } from 'react-query';
import { ReadHistoryPost } from '../graphql/posts';
import ShareIcon from '../../icons/share.svg';
import BookmarkIcon from '../../icons/bookmark.svg';
import BookmarkIconFilled from '../../icons/filled/bookmark_filled.svg';
import XIcon from '../../icons/x.svg';
import useBookmarkPost from '../hooks/useBookmarkPost';
import AuthContext from '../contexts/AuthContext';
import { ReadHistoryInfiniteData } from '../hooks/useInfiniteReadingHistory';
import { MenuIcon } from './MenuIcon';
import { QueryIndexes } from '../hooks/useReadingHistory';
import { useShareOrCopyLink } from '../hooks/useShareOrCopyLink';
import { postAnalyticsEvent } from '../lib/feed';
import { postEventName } from './utilities';

const PortalMenu = dynamic(() => import('./fields/PortalMenu'), {
  ssr: false,
});

export type PostOptionsReadingHistoryMenuProps = {
  post: ReadHistoryPost;
  onHiddenMenu?: () => unknown;
  displayCopiedMessageFunc?: () => void;
  onHideHistoryPost?: (postId: string) => unknown;
  indexes: QueryIndexes;
};

/* eslint-disable no-param-reassign */
const updateReadingHistoryPost =
  (
    queryClient: QueryClient,
    historyQueryKey: QueryKey,
    readHistoryPostUpdated: Partial<ReadHistoryPost>,
    { page, edge }: QueryIndexes,
  ): ((args: { id: string }) => Promise<() => void>) =>
  async () => {
    const oldReadingHistory =
      queryClient.getQueryData<ReadHistoryInfiniteData>(historyQueryKey);
    const newItems = [...oldReadingHistory.pages];
    const history = newItems[page].readHistory.edges[edge].node.post;
    newItems[page].readHistory.edges[edge].node.post = {
      ...history,
      ...readHistoryPostUpdated,
    };
    queryClient.setQueryData<ReadHistoryInfiniteData>(historyQueryKey, {
      ...oldReadingHistory,
      pages: newItems,
    });
    return () => {
      queryClient.setQueryData<ReadHistoryInfiniteData>(
        historyQueryKey,
        oldReadingHistory,
      );
    };
  };

const getBookmarkIconAndMenuText = (bookmarked: boolean) => {
  if (bookmarked) {
    return (
      <>
        <MenuIcon Icon={BookmarkIconFilled} />
        Remove from bookmarks
      </>
    );
  }
  return (
    <>
      <MenuIcon Icon={BookmarkIcon} />
      Save to bookmarks
    </>
  );
};

export default function PostOptionsReadingHistoryMenu({
  post,
  onHiddenMenu,
  onHideHistoryPost,
  indexes,
}: PostOptionsReadingHistoryMenuProps): ReactElement {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const historyQueryKey = ['readHistory', user?.id];
  const [, onShareOrCopyLink] = useShareOrCopyLink({
    link: post?.commentsPermalink,
    text: post?.title,
    trackObject: () =>
      postAnalyticsEvent('share post', post, {
        extra: { origin: 'reading history context menu' },
      }),
  });

  const { bookmark, removeBookmark } = useBookmarkPost({
    onBookmarkMutate: updateReadingHistoryPost(
      queryClient,
      historyQueryKey,
      {
        bookmarked: true,
      },
      indexes,
    ),
    onRemoveBookmarkMutate: updateReadingHistoryPost(
      queryClient,
      historyQueryKey,
      {
        bookmarked: false,
      },
      indexes,
    ),
    onBookmarkTrackObject: () =>
      postAnalyticsEvent(postEventName({ bookmarked: true }), post, {
        extra: { origin: 'reading history context menu' },
      }),
    onRemoveBookmarkTrackObject: () =>
      postAnalyticsEvent(postEventName({ bookmarked: false }), post, {
        extra: { origin: 'reading history context menu' },
      }),
  });

  const onBookmarkReadingHistoryPost = async (): Promise<void> => {
    if (post?.bookmarked) {
      return removeBookmark(post);
    }
    return bookmark(post);
  };

  return (
    <>
      <PortalMenu
        disableBoundariesCheck
        id="reading-history-options-context"
        className="menu-primary"
        animation="fade"
        onHidden={onHiddenMenu}
      >
        <Item className="typo-callout" onClick={onBookmarkReadingHistoryPost}>
          <span className="flex w-full typo-callout">
            {getBookmarkIconAndMenuText(post?.bookmarked)}
          </span>
        </Item>
        <Item className="typo-callout" onClick={() => onShareOrCopyLink()}>
          <span className="flex w-full typo-callout">
            <MenuIcon Icon={ShareIcon} /> Share article
          </span>
        </Item>
        <Item
          className="laptop:hidden typo-callout"
          onClick={() => onHideHistoryPost(post?.id)}
        >
          <span className="flex w-full typo-callout">
            <MenuIcon Icon={XIcon} /> Remove article
          </span>
        </Item>
      </PortalMenu>
    </>
  );
}
