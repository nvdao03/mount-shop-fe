import { useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddBrand, type TypeSchemaAddBrand } from '../../../validation/brand'
import { handleUploadImageHelper } from '../../../utils/other'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '../../../apis/shared/media.api'
import { useEffect, useState } from 'react'
import Loading from '../../../components/Loading'
import type { CategoryType } from '../../../types/category.type'
import { useNavigate } from 'react-router-dom'
import type { BrandQueryParamConfig } from '../../../configs/brand.config'
import useQueryParams from '../../../hooks/useQueryParams'
import { categoryApi } from '../../../apis/shared/category.api'
import { adminBrandApi } from '../../../apis/admin/brand.api'
import { toast } from 'react-toastify'
import { BRAND_MESSAGE } from '../../../constants/message'
import { PATH } from '../../../constants/path'

export default function AddBrand() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const queryParams: BrandQueryParamConfig = useQueryParams()
  const queryConfig: BrandQueryParamConfig = {
    limit: queryParams.limit || 30,
    page: queryParams.page || 1,
    search: queryParams.search || ''
  }

  const [imagePreview, setImagePreview] = useState<string>('')
  const [categories, setCategories] = useState<CategoryType[] | []>([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaAddBrand)
  })

  // --- Upload Image Mutation --- //
  const uploadImageMutation = useMutation({
    mutationFn: (files: FormData) => mediaApi.uploadImage(files),
    onSuccess: (response) => {
      const image = response.data.data[0].url
      setImagePreview(image)
    }
  })

  // --- Add Brand Mutation --- //
  const addBrandMutation = useMutation({
    mutationFn: (body: TypeSchemaAddBrand) => adminBrandApi.addBrand(body),
    onSuccess: () => {
      setImagePreview('')
      queryClient.invalidateQueries(['adminGetBrands'])
      queryClient.invalidateQueries(['getBrandsByCategoryId'])
      navigate(PATH.ADMIN_BRANDS)
      toast.success(BRAND_MESSAGE.CREATE_BRAND_SUCCESS)
    }
  })

  // --- File Upload --- //
  const handleOnChangeSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview('')
    handleUploadImageHelper(uploadImageMutation, e)
  }

  // --- Handle Submit Add Brand --- //
  const handleSubmitAddBrand = handleSubmit((data) => {
    addBrandMutation.mutate({
      ...data,
      image: imagePreview
    })
  })

  // --- Get Categories --- //
  useEffect(() => {
    const getCategories = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['adminGetCategories'],
        queryFn: () => categoryApi.getCategories(queryConfig)
      })
      setCategories(data.data.data.categories)
    }
    getCategories()
  }, [])

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Thêm Thương Hiệu
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
        <select
          className='w-[200px] border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2'
          {...register('category_id')}
        >
          <option value=''>Chọn danh mục</option>
          {categories.map((category: CategoryType) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className='flex-1 max-w-[180px] ml-auto bg-[#4F46E5] w-full mt-auto text-white rounded-lg py-3 text-center font-semibold'>
          Thêm thương hiệu
        </button>
      </form>
    </div>
  )
}
