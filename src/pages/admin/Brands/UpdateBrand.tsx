import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Input from '../../../components/Input'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaUpdateCategory, type TypeSchemaUpdateCategory } from '../../../validation/category'
import { mediaApi } from '../../../apis/shared/media.api'
import { handleUploadImageHelper } from '../../../utils/other'
import Loading from '../../../components/Loading'
import { adminBrandApi } from '../../../apis/admin/brand.api'
import { PATH } from '../../../constants/path'
import { toast } from 'react-toastify'
import { BRAND_MESSAGE } from '../../../constants/message'
import type { BrandType } from '../../../types/brand.type'

export default function UpdateBrand() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const params = useParams()
  const brand_id = Number(params.brand_id)

  const [imagePreview, setImagePreview] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schemaUpdateCategory),
    defaultValues: {
      image: '',
      name: ''
    }
  })

  // --- Get Brand Mutation --- //
  const getBrandMutation = useQuery({
    queryKey: ['getBrand'],
    queryFn: () => adminBrandApi.getBrand(brand_id)
  })

  // --- Upload Image Mutation --- //
  const uploadImageMutation = useMutation({
    mutationFn: (files: FormData) => mediaApi.uploadImage(files),
    onSuccess: (response) => {
      const image = response.data.data[0].url
      setImagePreview(image)
    }
  })

  // --- Update Brand Mutation --- //
  const updateBrandMutation = useMutation({
    mutationFn: (body: TypeSchemaUpdateCategory) => adminBrandApi.updateBrand(brand_id, body),
    onSuccess: () => {
      setImagePreview('')
      queryClient.invalidateQueries(['adminGetBrands'])
      queryClient.invalidateQueries(['getBrandsByCategoryId'])
      navigate(PATH.ADMIN_BRANDS)
      toast.success(BRAND_MESSAGE.UPDATE_BRAND_SUCCESS)
    }
  })

  // --- File Upload --- //
  const handleOnChangeSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview('')
    handleUploadImageHelper(uploadImageMutation, e)
  }

  // --- Handle Submit Update Brand --- //
  const handleSubmitAddBrand = handleSubmit((data) => {
    updateBrandMutation.mutate({
      ...data,
      image: imagePreview
    })
  })

  // --- Set Brand Form Values --- //
  useEffect(() => {
    if (!getBrandMutation?.data?.data) return
    const brand = getBrandMutation.data.data.data as BrandType
    setImagePreview(brand.image)
    setValue('name', brand.name)
    setValue('image', brand.image)
  }, [getBrandMutation?.data?.data])

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Chỉnh Sửa Thương Hiệu
      </div>
      {/* --- Form Submit Categories --- */}
      <form
        className='p-4 flex flex-col gap-5'
        encType='multipart/form-data'
        method='post'
        onSubmit={handleSubmitAddBrand}
      >
        <Input
          label='Tên Thương Hiệu'
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
          label='Ảnh Thương Hiệu'
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
          Cập nhật thương hiệu
        </button>
      </form>
    </div>
  )
}
