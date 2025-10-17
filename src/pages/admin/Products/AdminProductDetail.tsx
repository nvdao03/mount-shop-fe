import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { productApi } from '../../../apis/shared/product.api'
import Input from '../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddProduct } from '../../../validation/product'
import { useEffect, useState } from 'react'
import type { GetProductResponseSuccess } from '../../../types/product.type'

export default function AdminProductDetail() {
  const params = useParams()
  const product_id = Number(params.product_id)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imagesPreview, setImagesPreview] = useState<string[] | []>([])
  const [category, setCategory] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const {
    register,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaAddProduct)
  })

  // --- Get Product --- //
  const getProduct = useQuery({
    queryKey: ['adminGetProduct', product_id],
    queryFn: () => productApi.getProduct(product_id),
    staleTime: 30 * 60 * 1000
  })

  useEffect(() => {
    if (!getProduct?.data?.data) return
    const product = getProduct.data.data as GetProductResponseSuccess
    setImagePreview(product.data.image)
    setValue('name', product.data.name)
    setValue('price', product.data.price)
    setValue('price_before_discount', product.data.price_before_discount)
    setValue('stock', product.data.stock)
    setValue('sold', product.data.sold)
    setValue('rating', product.data.rating)
    setImagesPreview(product.data.images)
    setCategory(product.data.category.name)
    setBrand(product.data.brand.name)
    setDescription(product.data.description)
  }, [getProduct?.data?.data])

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Thêm Sản Phẩm
      </div>
      {/* --- Product --- */}
      <div className='p-4 flex flex-col gap-5 h-[calc(100vh-120px)] overflow-y-scroll'>
        {/* Row 1 */}
        <Input
          disabled={true}
          label='Tên Sản Phẩm'
          classNameLabel='block mb-2'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.name?.message as string}
          type='text'
          name='name'
        />
        {/* Row 2 */}
        <div className='flex items-center justify-between gap-5 w-full'>
          <div className='w-full'>
            <Input
              disabled={true}
              label='Giá Gốc (VNĐ)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.price_before_discount?.message as string}
              type='text'
              name='price_before_discount'
              placeholder='Nhập giá gốc ...'
              errors={errors.price_before_discount}
            />
          </div>
          <div className='w-full'>
            <Input
              disabled={true}
              label='Giá Giảm (VNĐ)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.price?.message as string}
              type='text'
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
            <input
              disabled
              type='text'
              value={category}
              className='bg-transparent text-[14px] md:text-[15px] w-full h-10 border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
          <div className='w-full relative'>
            <label className='block mb-2'>Thương Hiệu</label>
            <input
              disabled
              type='text'
              value={brand}
              className='bg-transparent text-[14px] md:text-[15px] w-full h-10 border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
        </div>
        {/* Row 4 */}
        <div className='flex items-center justify-between gap-5 w-full'>
          <div className='w-full'>
            <Input
              label='Tồn Kho'
              disabled={true}
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
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
              disabled={true}
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
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
              disabled={true}
              label='Đánh Giá (Rating)'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='bg-transparent text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              type='text'
              name='rating'
            />
          </div>
        </div>
        {/* Row 5 */}
        <div>
          <span className='block mb-2'>Ảnh Sản Phẩm Chính</span>
          {imagePreview && (
            <div className='w-[128px] h-[128px] rounded-md'>
              <img src={imagePreview} alt='image preview' className='w-full h-full object-cover rounded-lg' />
            </div>
          )}
        </div>
        {/* Row 6 */}
        <div>
          <span className='block mb-2'>Ảnh Sản Phẩm Phụ</span>
          <div className='flex items-center gap-5'>
            {imagesPreview &&
              imagesPreview.map((image, index) => (
                <div key={index} className='w-[128px] h-[128px] rounded-md'>
                  <img src={image} alt='image preview' className='w-full h-full object-cover rounded-lg' />
                </div>
              ))}
          </div>
        </div>
        {/* Row 7 */}
        <div>
          <label className='block mb-2'>Mô Tả Sản Phẩm</label>
          <div
            dangerouslySetInnerHTML={{
              __html: description
            }}
            className='text-[14px] md:text-[15px] leading-[1.5] min-h-[60px] max-h-[200px] md:max-h-[300px] overflow-y-auto w-full border border-solid border-[#B3B3B3] bg-transparent rounded-lg py-2 px-3'
          ></div>
        </div>
      </div>
    </div>
  )
}
