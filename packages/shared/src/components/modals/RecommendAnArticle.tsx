import React, { ReactElement, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import request from 'graphql-request';
import { Button } from '../buttons/Button';
import { Loader } from '../Loader';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalProps } from './StyledModal';
import { formToJson } from '../../lib/form';
import { apiUrl } from '../../lib/config';
import {
  contentGuidlines,
  requestAccessRecommendAnArticle,
} from '../../lib/constants';
import { ResponsiveModal } from './ResponsiveModal';
import { TextField } from '../fields/TextField';
import LinkIcon from '../../../icons/link.svg';
import { RECOMMEND_ARTICLE_MUTATION } from '../../graphql/recommendArticle';
import PostItemCard from '../post/PostItemCard';
import { PostItem } from '../../graphql/posts';

type RecommendAnArticleProps = {
  isEnabled: boolean;
} & ModalProps;

export default function RecommendAnArticle({
  isEnabled,
  onRequestClose,
  ...modalProps
}: RecommendAnArticleProps): ReactElement {
  const recommendFormRef = useRef<HTMLFormElement>();
  const [enableSubmission, setEnableSubmission] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingArticle, setExistingArticle] = useState<PostItem>(null);
  const [urlHint, setUrlHint] = useState<string>();

  const { mutateAsync: recommendArticle } = useMutation<
    unknown,
    unknown,
    string
  >((articleUrl: string) =>
    request(`${apiUrl}/graphql`, RECOMMEND_ARTICLE_MUTATION, {
      data: { url: articleUrl },
    }),
  );

  const onUrlChanged = () => {
    if (recommendFormRef.current) {
      if (recommendArticle) {
        setExistingArticle(null);
      }
      if (urlHint) {
        setUrlHint(null);
      }
      setEnableSubmission(recommendFormRef.current.checkValidity());
    }
  };

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const data = formToJson<{ articleUrl: string }>(event.currentTarget);
    setIsValidating(true);

    if (!data.articleUrl) {
      setUrlHint('Please submit a valid URL');
      setIsValidating(false);

      return;
    }

    const res = await recommendArticle(data.articleUrl);

    setIsValidating(false);
    if ('error' in res) {
      setUrlHint(res?.message);
      setEnableSubmission(false);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <ResponsiveModal
      {...modalProps}
      onRequestClose={onRequestClose}
      padding={false}
    >
      <header className="flex justify-between items-center py-4 px-6 w-full border-b border-theme-divider-tertiary">
        <h3 className="font-bold typo-title3">Recommend an article</h3>
        <ModalCloseButton onClick={onRequestClose} />
      </header>
      <section className="overflow-auto relative px-10 pt-6 pb-10 w-full h-full shrink max-h-full">
        <p className="mb-2 typo-callout text-theme-label-tertiary">
          Found an interesting article? Do you want to share it with the
          community? Enter the article's URL / link below to add it to the feed.
        </p>
        <a
          className="font-bold underline typo-callout text-theme-label-link"
          target="_blank"
          rel="noopener"
          href={contentGuidlines}
        >
          Content guidelines
        </a>
        <p className="mt-6 mb-4 typo-callout">Daily suggestions used 0/3</p>
        <form
          className="w-full"
          ref={recommendFormRef}
          aria-busy={isValidating}
          onSubmit={onSubmit}
        >
          <TextField
            autoFocus
            type="url"
            leftIcon={<LinkIcon />}
            fieldType="tertiary"
            name="articleUrl"
            inputId="article_url"
            label="Paste article url"
            disabled={!isEnabled}
            hint={urlHint}
            valid={!urlHint}
            valueChanged={onUrlChanged}
          />
          {isSubmitted && (
            <>
              <div className="flex items-center mt-4 mb-6 h-8 font-bold rounded-10 w-fit bg-theme-status-success text-theme-label-invert padding px-[0.9375rem]">
                Request sent
              </div>
              <p className="mb-2 typo-callout text-theme-label-tertiary">
                You will be notified via email about the article request status.
              </p>
            </>
          )}

          {isEnabled ? (
            <Button
              className="mt-4 btn-primary "
              buttonSize="small"
              type="submit"
              aria-label="Submit article"
              disabled={!isEnabled || !enableSubmission}
            >
              <span className={isValidating && 'invisible'}>
                Submit article
              </span>
              {isValidating && (
                <Loader className="absolute inset-x-0 top-1 mx-auto" />
              )}
            </Button>
          ) : (
            <Button
              tag="a"
              href={requestAccessRecommendAnArticle}
              target="_blank"
              rel="noopener"
              aria-label="Request access"
              className="mt-4 w-fit btn-secondary"
            >
              Request access
            </Button>
          )}
        </form>
      </section>
      {existingArticle && (
        <div>
          <div className="px-10 pb-3.5 border-b border-theme-divider-tertiary">
            <p className="font-bold typo-callout">Article exists</p>
          </div>
          <PostItemCard postItem={existingArticle} showButtons={false} />
        </div>
      )}
    </ResponsiveModal>
  );
}
