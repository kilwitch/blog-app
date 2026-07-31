import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button, Input, Select,RTE} from '../index'
import service from '../../appwrite/config' 
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


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

    React.useEffect(() => {
        if (post) {
            reset({
                title: post.title || '',
                slug: post.slug || post.$id || '',
                content: post.content || '',
                status: post.status || 'active',
            })
        }
    }, [post, reset])

    React.useEffect(() => {
        if (selectedImage && selectedImage[0]) {
            const file = selectedImage[0]
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)

            return () => {
                URL.revokeObjectURL(previewUrl)
            }
        } else {
            setImagePreview(null)
        }
    }, [selectedImage])

    const submit= async (data)=>{
        setSubmitError('')
        // Destructure to strip out fields not stored in Appwrite collection:
        // 'image' is a FileList, 'slug' is used as document ID — neither are DB attributes
        const {image, slug, ...postData} = data

        console.log('PostForm :: submit :: form data:', { slug, postData, hasImage: !!(image && image[0]), userId: userData?.$id })

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

                console.log('PostForm :: uploading file...')
                const file = await service.uploadFile(image[0]);
                console.log('PostForm :: file uploaded:', file)

                console.log('PostForm :: creating post with:', {
                    ...postData,
                    slug,
                    featuredImage: file.$id,
                    userId: userData.$id,
                })
                const dbPost = await service.createPost({
                    ...postData,
                    slug,
                    featuredImage: file.$id,
                    userId: userData.$id,
                })
                console.log('PostForm :: post created:', dbPost)
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        } catch (error) {
            console.error('PostForm :: submit :: error', error)
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
    <form onSubmit={handleSubmit(submit, (errors) => console.error("PostForm :: Validation Errors ::", errors))} className="flex flex-wrap">
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

