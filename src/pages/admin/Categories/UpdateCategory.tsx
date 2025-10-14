import { useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaUpdateCategory, type TypeSchemaUpdateCategory } from '../../../validation/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '../../../apis/shared/media.api'
import { handleUploadImageHelper } from '../../../utils/other'
import { useEffect, useState } from 'react'
import Loading from '../../../components/Loading'
import { adminCategoryApi } from '../../../apis/admin/category.api'
import { toast } from 'react-toastify'
import { CATEGORY_MESSAGE } from '../../../constants/message'
import { useNavigate, useParams } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import type { CategoryType } from '../../../types/category.type'

export default function UpdateCategory() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const params = useParams()
  const [imagePreview, setImagePreview] = useState<string>('')
  const category_id = Number(params.category_id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schemaUpdateCategory),
    defaultValues: {
      name: '',
      image: ''
    }
  })

  // --- Get Category Detail --- //
  const getCategoryDetail = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => adminCategoryApi.getCategoryDetail(category_id)
  })

  // --- Upload Image Mutation --- //
  const uploadImageMutation = useMutation({
    mutationFn: (files: FormData) => mediaApi.uploadImage(files),
    onSuccess: (response) => {
      const image = response.data.data[0].url
      setImagePreview(image)
    }
  })

  // --- Update Category Mutation --- //
  const updateCategoryMutation = useMutation({
    mutationFn: (body: TypeSchemaUpdateCategory) => adminCategoryApi.updateCategory(category_id, body),
    onSuccess: () => {
      setImagePreview('')
      toast.success(CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS)
      queryClient.invalidateQueries(['getCategories'])
      queryClient.invalidateQueries(['adminGetCategories'])
      navigate(PATH.ADMIN_CATEGORIES)
    }
  })

  // --- Handle File Upload --- //
  const handleOnChangeSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview('')
    handleUploadImageHelper(uploadImageMutation, e)
  }

  // --- Handle Submit Add Category --- //
  const handleSubmitUpdateCategory = handleSubmit((data: TypeSchemaUpdateCategory) => {
    updateCategoryMutation.mutate({
      ...data,
      image: imagePreview
    })
  })

  useEffect(() => {
    if (!getCategoryDetail?.data?.data) return
    const category = getCategoryDetail.data.data.data as CategoryType
    setImagePreview(category.image)
    setValue('name', category.name)
    setValue('image', category.image)
  }, [getCategoryDetail?.data?.data, setValue])

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Chỉnh Sửa Danh Mục
      </div>
      {/* --- Form Submit Categories --- */}
      <form
        className='p-4 flex flex-col gap-5'
        encType='multipart/form-data'
        method='post'
        onSubmit={handleSubmitUpdateCategory}
      >
        <Input
          label='Tên Danh Mục'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.name?.message as string}
          type='text'
          name='name'
          errors={errors.name}
        />
        <Input
          handleOnChangeSubmitImage={handleOnChangeSubmitImage}
          label='Ảnh Danh Mục'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[14px] md:text-[15px] w-full h-full placeholder:text-[#666] placeholder:text-sm py-2 outline-none'
          register={register}
          errorMessage={errors?.image?.message as string}
          type='file'
          name='image'
          errors={errors.image}
        />
        {uploadImageMutation.isLoading && (
          <div className='w-[128px] h-[128px] rounded-md'>
            <Loading />
          </div>
        )}
        {imagePreview && (
          <div className='w-[128px] h-[128px] rounded-md'>
            <img src={imagePreview} alt='image preview' className='w-full h-full object-cover rounded-lg' />
          </div>
        )}
        <button className='flex-1 max-w-[180px] ml-auto bg-[#4F46E5] w-full mt-auto text-white rounded-lg py-3 text-center font-semibold'>
          Cập nhật danh mục
        </button>
      </form>
    </div>
  )
}
