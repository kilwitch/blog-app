import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import service from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/react';
import { toast } from 'sonner';

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || post?.$id || '',
      content: post?.content || '',
      status: post?.status || 'active',
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [submitError, setSubmitError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const selectedImage = watch('image');

  // Tags state
  const [tags, setTags] = useState(post?.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Tag handler - strip leading #
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  // Delete tags
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  React.useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        slug: post.slug || post.$id || '',
        content: post.content || '',
        status: post.status || 'active',
      });
      setTags((post.tags || []).map((t) => (typeof t === 'string' ? t.replace(/^#/, '') : t)));
    }
  }, [post, reset]);

  React.useEffect(() => {
    if (selectedImage && selectedImage[0]) {
      const file = selectedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const submit = async (data) => {
    setSubmitError('');
    const { image, slug, ...postData } = data;

    Sentry.addBreadcrumb({
      category: 'post-form',
      message: 'Submitting post form',
      data: { slug, hasImage: !!(image && image[0]), userId: userData?.$id },
      level: 'info',
    });

    try {
      if (post) {
        // Edit mode: upload file if new one selected
        const file = image && image[0] ? await service.uploadFile(image[0]) : null;

        if (file) {
          await service.deleteFile(post.featuredImage);
        }

        const dbPost = await service.updatePost(post.$id, {
          ...postData,
          featuredImage: file ? file.$id : post.featuredImage,
          authorName: userData?.name,
          tags,
        });
        if (dbPost) {
          toast.success('Post updated successfully!');
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // Create mode: featured image is required
        if (!image || !image[0]) {
          const errorMsg = 'Please select a featured image.';
          setSubmitError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        if (!userData?.$id) {
          const errorMsg = 'You must be logged in to create a post.';
          setSubmitError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        Sentry.addBreadcrumb({
          category: 'post-form',
          message: 'Uploading post file',
          level: 'info',
        });
        const file = await service.uploadFile(image[0]);

        Sentry.addBreadcrumb({
          category: 'post-form',
          message: `File uploaded successfully: ${file.$id}`,
          level: 'info',
        });

        const dbPost = await service.createPost({
          ...postData,
          slug,
          featuredImage: file.$id,
          userId: userData.$id,
          authorName: userData?.name,
          tags,
        });
        if (dbPost) {
          toast.success('Post published successfully!');
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('location', 'PostForm :: submit');
        Sentry.captureException(error);
      });

      const isConflict =
        error?.code === 409 ||
        error?.status === 409 ||
        error?.type === 'document_already_exists' ||
        error?.message?.toLowerCase().includes('already exists');

      const errorMsg = isConflict
        ? 'A post with this title already exists. Please choose a different title.'
        : error?.message || 'Something went wrong. Please try again.';

      setSubmitError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string') {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .substring(0, 36);
    }
    return '';
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        if (!post) {
          setValue('slug', slugTransform(value.title), { shouldValidate: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue, post]);

  return (
    <div className="max-w-5xl mx-auto bg-white border border-[#e1e2e9] rounded-2xl p-6 md:p-8 shadow-xs font-['Geist',sans-serif]">
      <form
        onSubmit={handleSubmit(submit, (errors) => {
          Sentry.withScope((scope) => {
            scope.setTag('location', 'PostForm :: validation');
            scope.setExtra('validationErrors', errors);
            Sentry.captureMessage('PostForm validation failed', 'warning');
          });
        })}
        className="flex flex-col lg:flex-row gap-8"
      >
        {/* Error Notification */}
        {submitError && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium text-sm text-center font-['JetBrains_Mono',monospace]">
            {submitError}
          </div>
        )}

        {/* Left Column: Title, Slug & Content Editor */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <Input
            label="Post Title"
            placeholder="Enter an intriguing title..."
            {...register('title', { required: true })}
          />

          <Input
            label="Post Slug / Document ID"
            placeholder="my-first-post"
            className={`${post ? 'bg-[#ecedf5] cursor-not-allowed text-[#5a4138]' : ''}`}
            readOnly={!!post}
            {...register('slug', { required: !post })}
            onInput={(e) => {
              if (!post) {
                setValue('slug', slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }
            }}
          />

          <div>
            <label className="inline-block mb-1.5 font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#5a4138] uppercase tracking-wider">
              Article Content
            </label>
            <RTE name="content" control={control} defaultValue={getValues('content')} />
          </div>
        </div>

        {/* Right Column: Featured Image, Tags, Status & Action */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Featured Image Picker */}
          <div>
            <Input
              label="Featured Cover Image"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              {...register('image', {
                required: !post ? 'Featured image is required' : false,
                validate: {
                  fileSize: (files) => {
                    if (!files || !files[0]) return true;
                    const MAX_SIZE = 5 * 1024 * 1024;
                    return files[0].size <= MAX_SIZE || 'Image size must be under 5MB';
                  },
                  fileType: (files) => {
                    if (!files || !files[0]) return true;
                    const allowedTypes = [
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      'image/gif',
                      'image/webp',
                    ];
                    return (
                      allowedTypes.includes(files[0].type) ||
                      'Only JPG, PNG, GIF, and WEBP images are allowed'
                    );
                  },
                },
              })}
            />
            {errors.image && (
              <p className="text-red-500 text-xs font-semibold mt-1 font-['JetBrains_Mono',monospace]">
                {errors.image.message}
              </p>
            )}

            {(imagePreview || post?.featuredImage) && (
              <div className="mt-3">
                <p className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#5a4138] mb-1.5 uppercase tracking-wider">
                  {imagePreview ? 'New Image Preview' : 'Current Cover Image'}
                </p>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#e1e2e9] bg-[#f2f3fa] shadow-xs">
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : service.getFilePreview(post.featuredImage)?.href ||
                          service.getFilePreview(post.featuredImage)
                    }
                    alt={post?.title || 'Featured Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags Manager */}
          <div>
            <label className="inline-block mb-1.5 font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#5a4138] uppercase tracking-wider">
              Topic Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag (e.g. React)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#f2f3fa] text-[#191c21] border border-[#e1e2e9] outline-none focus:bg-white focus:border-[#ea580c] text-xs font-['JetBrains_Mono',monospace]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex-shrink-0"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f2f3fa] text-[#5a4138] border border-[#e1e2e9] text-xs font-['JetBrains_Mono',monospace] font-medium rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#ea580c] hover:text-[#c2410c] font-bold text-sm leading-none ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <Select
            options={['active', 'inactive']}
            label="Publish Status"
            className="mb-2"
            {...register('status', { required: true })}
          />

          {/* Form Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-sm font-['Geist',sans-serif] mt-2"
          >
            {post ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
