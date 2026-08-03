import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button, Input, Select,RTE} from '../index'
import service from '../../appwrite/config' 
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as Sentry from '@sentry/react'


export default function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues, reset}= useForm({
        defaultValues:{
            title: post?.title || '',
            slug: post?.slug || post?.$id || '',
            content:post?.content || '',
            status: post?.status || 'active',

        }
    })

    const navigate=useNavigate()
    const userData= useSelector(state =>state.auth.userData)
    const [submitError, setSubmitError] = useState('')
    const [imagePreview, setImagePreview] = useState(null)

    const selectedImage = watch("image")

    //tags
    const[tags, setTags]= useState(post?.tags || []);
    const [tagInput, setTagInput]= useState('');


    // tag handler
    const handleAddTag=(e)=>{
        e.preventDefault();
        const trimmed= tagInput.trim();
        if(trimmed && !tags.includes(trimmed)){
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    }

    // delete tags
    const handleRemoveTag= (tagToRemove)=>{
        setTags(tags.filter((tag)=> tag !== tagToRemove));
    }
    React.useEffect(() => {
        if (post) {
            reset({
                title: post.title || '',
                slug: post.slug || post.$id || '',
                content: post.content || '',
                status: post.status || 'active',
            })
            setTags(post.tags || [])
        }
    }, [post, reset])

    React.useEffect(() => {
        if (selectedImage && selectedImage[0]) {
            const file = selectedImage[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }, [selectedImage])

    const submit= async (data)=>{
        setSubmitError('')
        // Destructure to strip out fields not stored in Appwrite collection:
        // 'image' is a FileList, 'slug' is used as document ID — neither are DB attributes
        const {image, slug, ...postData} = data

        Sentry.addBreadcrumb({
            category: 'post-form',
            message: 'Submitting post form',
            data: { slug, hasImage: !!(image && image[0]), userId: userData?.$id },
            level: 'info'
        })

        try {
            if(post){
                // Edit mode: only upload a new file if one was selected
                const file = (image && image[0]) ? await service.uploadFile(image[0]) : null
            
                if(file){
                    await service.deleteFile(post.featuredImage)
                }

                const dbPost = await service.updatePost(post.$id, {
                    ...postData,
                    featuredImage: file ? file.$id : post.featuredImage,
                    tags, // pass atgs state
                })
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }else{
                // Create mode: image is required
                if (!image || !image[0]) {
                    setSubmitError('Please select a featured image.')
                    return
                }

                if (!userData?.$id) {
                    setSubmitError('You must be logged in to create a post.')
                    return
                }

                Sentry.addBreadcrumb({
                    category: 'post-form',
                    message: 'Uploading post file',
                    level: 'info'
                })
                const file = await service.uploadFile(image[0]);

                Sentry.addBreadcrumb({
                    category: 'post-form',
                    message: `File uploaded successfully: ${file.$id}`,
                    level: 'info'
                })

                const dbPost = await service.createPost({
                    ...postData,
                    slug,
                    featuredImage: file.$id,
                    userId: userData.$id,
                    tags, //pass tag state
                })
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag('location', 'PostForm :: submit');
                Sentry.captureException(error);
            });
            setSubmitError(error?.message || 'Something went wrong. Please try again.')
        }
    }

    const slugTransform= useCallback((value)=> {
        if(value && typeof value=== 'string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-")
            .replace(/^-+/, "")       // remove leading hyphens (invalid for Appwrite doc ID)
            .replace(/-+$/, "")       // remove trailing hyphens
            .substring(0, 36);        // Appwrite doc IDs max 36 chars

        }
        return ""
    },[])

    React.useEffect(()=>{
        const subscription= watch((value,{name})=> {
            if(name ==='title'){
                // Only auto-generate slug in create mode (when post is not present)
                if (!post) {
                    setValue('slug', slugTransform(value.title), {shouldValidate: true})
                }
            }
        })

        return ()=>{
            subscription.unsubscribe()
        }
    },[watch, slugTransform, setValue, post])

  return (
    <form onSubmit={handleSubmit(submit, (errors) => {
        Sentry.withScope((scope) => {
            scope.setTag('location', 'PostForm :: validation');
            scope.setExtra('validationErrors', errors);
            Sentry.captureMessage('PostForm validation failed', 'warning');
        });
    })} className="flex flex-wrap">
        {submitError && (
            <div className="w-full mb-4 px-2">
                <p className="text-red-600 text-center font-medium">{submitError}</p>
            </div>
        )}
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                 <Input
                    label="Slug :"
                    placeholder="Slug"
                    className={`mb-4 ${post ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={!!post}
                    {...register("slug", { required: !post })}
                    onInput={(e) => {
                        if (!post) {
                            setValue(
                                "slug",
                                slugTransform(e.currentTarget.value),
                                { shouldValidate: true }
                            );
                        }
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {(imagePreview || post?.featuredImage) && (
                    <div className="w-full mb-4">
                        <p className="text-xs font-semibold mb-1 text-gray-500">
                            {imagePreview ? "Selected New Image Preview:" : "Current Image:"}
                        </p>
                        <img
                            src={imagePreview ? imagePreview : (service.getFilePreview(post.featuredImage)?.href || service.getFilePreview(post.featuredImage))}
                            alt={post?.title || "Featured Image"}
                            className="rounded-lg max-h-64 object-cover w-full"
                        />
                    </div>
                )}

                <div className="mb-4">
                        <label className="inline-block mb-1 pl-1 font-semibold text-gray-700">Tags :</label>
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
                                className="w-full px-3 py-1.5 rounded-lg bg-white text-black outline-none border border-gray-300 text-sm"
                            />
                            <Button type="button" onClick={handleAddTag} bgColor="bg-blue-500" className="px-3 py-1 text-sm">
                                Add
                            </Button>
                        </div>
                        {/* Display Active Tags with Delete '×' Button */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1.5 text-blue-600 hover:text-blue-900 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                </div>

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}

