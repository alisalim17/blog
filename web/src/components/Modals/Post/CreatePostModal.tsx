import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import Creatable from 'react-select/creatable';

import Button from '@/ui/buttons/Button';
import InputField from '@/ui/Form/InputField';
import Label from '@/ui/Form/Label';
import Modal from '@/ui/Modal/Modal';

import { formatCategories } from '@/components/utils/formatCategories';
import { formatTags } from '@/components/utils/formatTags';
import {
  CategorySnippetFragment,
  TagSnippetFragment,
  useCategoriesQuery,
  useCreatePostMutation,
  useTagsQuery,
} from '@/generated/graphql';
import { toErrorMap } from '../../../utils/toErrorMap';

interface ISelectOption {
  label: string;
  value: string;
}

const CreatePostModal = () => {
  const [_, createPostMutation] = useCreatePostMutation();
  const [{ data: tags }] = useTagsQuery();
  const [{ data: categories }] = useCategoriesQuery();
  const router = useRouter();

  // @todo optimize this
  // parsing database tags array to react-select options
  const tagsArr = useMemo(
    () => formatTags(tags?.tags as TagSnippetFragment[]),
    [tags]
  );

  const categoriesArr = useMemo(
    () => formatCategories(categories?.categories as CategorySnippetFragment[]),
    [categories]
  );

  return (
    <Modal openModalText='+ Create a new one'>
      <Modal.Header>Create post</Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            title: '',

            description: '',
            tags: [],
            url: '',
            categoryName: {} as ISelectOption,
          }}
          onSubmit={async (props, { setErrors }) => {
            props.tags = props.tags.map((t: ISelectOption) => {
              return t.value;
            }) as any;

            const input = {
              ...props,
              isVideo: true,
              categoryName: (props.categoryName.value as string) || '',
            };
            const { data } = await createPostMutation({
              input,
            });
            const post = data?.createPost;
            if (post?.errors) {
              setErrors(toErrorMap(post?.errors as any));
            } else if (post?.ok) {
              // redirecting to the new post
              router.push(`/p/${post?.post?.id}`);
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form className='mt-12 space-y-4'>
              <InputField
                name='title'
                label='Title'
                placeholder='Enter title...'
              />
              <InputField
                name='description'
                label='Description'
                placeholder='Enter description...'
                textarea
              />
              <InputField
                name='url'
                label='Url'
                placeholder='Enter youtube video url...'
              />
              <div>
                <Label fieldName='tags'>Tags</Label>
                <Creatable
                  maxMenuHeight={200}
                  name='tags'
                  isMulti
                  onChange={(myTagsArr) => setFieldValue('tags', myTagsArr)}
                  options={tagsArr}
                />
              </div>
              <div>
                <Label fieldName='category'>Category</Label>
                <ReactSelect
                  maxMenuHeight={200}
                  name='category'
                  options={categoriesArr}
                />
              </div>

              <Modal.Footer>
                <Button type='submit' className='ml-2 px-4'>
                  Post
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
