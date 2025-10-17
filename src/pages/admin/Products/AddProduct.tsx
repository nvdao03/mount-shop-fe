import { Controller, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddProduct } from '../../../validation/product'
import { useState } from 'react'
import Loading from '../../../components/Loading'
import { handleUploadImageHelper } from '../../../utils/other'
import { useMutation, useQuery } from '@tanstack/react-query'
import { mediaApi } from '../../../apis/shared/media.api'
import { categoryApi } from '../../../apis/shared/category.api'
import type { CategoryType } from '../../../types/category.type'
import type { BrandType } from '../../../types/brand.type'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { adminProductApi } from '../../../apis/admin/product.api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PRODUCT_MESSAGE } from '../../../constants/message'
import { PATH } from '../../../constants/path'

export default function AddProduct() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesPreview, setImagesPreview] = useState<string[] | []>([])
  const [categoryId, setCaregoryId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schemaAddProduct)
  })

  // --- Get Categories --- //
  const getCategories = useQuery({
    queryKey: ['adminGetCategories'],
    queryFn: () => categoryApi.getCategories()
  })

  // --- Get Brand By Caregory Id --- //
  const getBrandByCategoryId = useQuery({
    queryKey: ['adminGetBrandByCategoryId', categoryId],
    queryFn: () => categoryApi.getBrandsByCategoryId(categoryId as number),
    enabled: !!categoryId
  })

  // --- Upload Image Mutation --- //
  const uploadImageMutation = useMutation({
    mutationFn: (file: FormData) => mediaApi.uploadImage(file),
    onSuccess: (response) => {
      const image = response.data.data[0].url
      setImagePreview(image)
    }
  })

  // --- Upload Images Mutation --- //
  const uploadImagesMutation = useMutation({
    mutationFn: (file: FormData) => mediaApi.uploadImage(file),
    onSuccess: (response) => {
      const images = response.data.data.map((item: any) => item.url)
      setImagesPreview(images)
    }
  })

  // --- Add Product Mutation --- //
  const addProductMutation = useMutation({
    mutationFn: (body: {
      name: string
      description: string
      image: string
      images: string[]
      price_before_discount: number
      price: number
      rating: string
      sold: number
      stock: number
      category_id: number
      brand_id: number
    }) =>
      adminProductApi.addProduct({
        ...body,
        image: imagePreview as string,
        images: imagesPreview
      }),
    onSuccess: () => {
      toast.success(PRODUCT_MESSAGE.ADD_PRODUCT_SUCCESS)
      navigate(PATH.ADMIN_PRODUCTS)
    }
  })

  // --- Handle Submit Image --- //
  const handleOnChangeSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview('')
    handleUploadImageHelper(uploadImageMutation, e)
  }

  // --- Handle Submit Images --- //
  const handleOnChangeSubmitImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagesPreview([])
    handleUploadImageHelper(uploadImagesMutation, e)
  }

  // --- Handle Submit Add Product ---
  const handleSubmitAddProduct = handleSubmit((data: any) => {
    addProductMutation.mutate({
      ...data,
      images: imagesPreview,
      image: imagePreview as string
    })
  })

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Thêm Sản Phẩm
      </div>
      {/* --- Form Submit Product --- */}
      <form
        className='p-4 flex flex-col gap-5 h-[calc(100vh-120px)] overflow-y-scroll'
        encType='multipart/form-data'
        method='post'
        onSubmit={handleSubmitAddProduct}
      >
        {/* Row 1 */}
        <Input
          label='Tên Sản Phẩm'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.name?.message as string}
          type='text'
          name='name'
          placeholder='Nhập tên sản phẩm ...'
          errors={errors.name}
        />
        {/* Row 2 */}
        <div className='flex items-center justify-between gap-5 w-full'>
          <div className='w-full'>
            <Input
              label='Giá Gốc (VNĐ)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.price_before_discount?.message as string}
              type='number'
              name='price_before_discount'
              placeholder='Nhập giá gốc ...'
              errors={errors.price_before_discount}
            />
          </div>
          <div className='w-full'>
            <Input
              label='Giá Giảm (VNĐ)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.price?.message as string}
              type='number'
              name='price'
              placeholder='Nhập giá giảm ...'
              errors={errors.price}
            />
          </div>
        </div>
        {/* Row 3 */}
        <div className='flex items-center justify-between gap-5 w-full'>
          <div className='w-full relative'>
            <label className='block mb-2'>Danh Mục</label>
            <select
              className='appearance-none w-full h-10 outline-none border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2'
              {...register('category_id')}
              onChange={(e) => setCaregoryId(Number(e.target.value))}
            >
              <option value=''>--- Chọn danh mục ---</option>
              {getCategories.data?.data &&
                getCategories.data?.data.data.categories.map((category: CategoryType) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-4 h-4 text-gray-600 absolute right-3 top-[75%] -translate-y-[75%] pointer-events-none'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
          <div className='w-full relative'>
            <label className='block mb-2'>Thương Hiệu</label>
            <select
              className='appearance-none w-full h-10 outline-none border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2'
              {...register('brand_id')}
            >
              <option value=''>--- Chọn thương hiệu ---</option>\
              {getBrandByCategoryId?.data?.data &&
                getBrandByCategoryId?.data?.data.data.brands.map((brand: BrandType) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-4 h-4 text-gray-600 absolute right-3 top-[75%] -translate-y-[75%] pointer-events-none'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
        {/* Row 4 */}
        <div className='flex items-center justify-between gap-5 w-full'>
          <div className='w-full'>
            <Input
              label='Tồn Kho'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px] leading-[1.5]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.stock?.message as string}
              type='text'
              name='stock'
              placeholder='Nhập số lượng tồn kho ...'
              errors={errors.stock}
            />
          </div>
          <div className='w-full'>
            <Input
              label='Đã Bán'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px] leading-[1.5]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.sold?.message as string}
              type='text'
              name='sold'
              placeholder='Nhập số lượng đã bán ...'
              errors={errors.sold}
            />
          </div>
          <div className='w-full'>
            <Input
              label='Đánh Giá (Rating)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px] leading-[1.5]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.rating?.message as string}
              type='text'
              name='rating'
              placeholder='0 - 5'
              errors={errors.rating}
            />
          </div>
        </div>
        {/* Row 5 */}
        <Input
          handleOnChangeSubmitImage={handleOnChangeSubmitImage}
          label='Ảnh Sản Phẩm Chính'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[14px] md:text-[15px] w-full h-full placeholder:text-[#666] placeholder:text-sm py-2 outline-none'
          register={register}
          type='file'
          name='image'
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
        {/* Row 6 */}
        <Input
          handleOnChangeSubmitImage={handleOnChangeSubmitImages}
          multiple={true}
          label='Ảnh Sản Phẩm Phụ (có thể chọn nhiều ảnh)'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[14px] md:text-[15px] w-full h-full placeholder:text-[#666] placeholder:text-sm py-2 outline-none'
          register={register}
          type='file'
          name='images'
        />
        {uploadImagesMutation.isLoading && (
          <div className='w-[128px] h-[128px] rounded-md'>
            <Loading />
          </div>
        )}
        {imagesPreview && (
          <div className='flex items-center gap-5'>
            {imagesPreview.map((image, index) => (
              <div key={index} className='w-[128px] h-[128px] rounded-md'>
                <img src={image} alt='image preview' className='w-full h-full object-cover rounded-lg' />
              </div>
            ))}
          </div>
        )}
        {/* Row 7 */}
        <div>
          <label className='block mb-2'>Mô Tả Sản Phẩm</label>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <div className='rounded-lg overflow-hidden border border-solid border-[#B3B3B3]'>
                <ReactQuill
                  {...field}
                  theme='snow'
                  placeholder='Nhập mô tả chi tiết sản phẩm ...'
                  className='text-[15px] md:text-[15px] leading-[1.5] bg-transparent outline-none resize-none'
                  style={{
                    height: '300px'
                  }}
                />
              </div>
            )}
          />
        </div>
        <div className='text-right mt-auto'>
          <button className='flex-1 max-w-[180px] h-10 ml-auto bg-[#4F46E5] w-full mt-auto text-white rounded-lg py-3 text-center font-semibold'>
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  )
}
