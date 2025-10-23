import { Link, useNavigate, useParams } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import ArrowRight from '../../../assets/icons/arrow-right.svg'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../../../apis/shared/product.api'
import { useMemo, useState } from 'react'
import type { GetProductResponseSuccess } from '../../../types/product.type'
import { PATH } from '../../../constants/path'
import { fomatNumberToSocialStyle, formatCurrency, formatTime, rateSale } from '../../../utils/other'
import ProductDetailBg from '../../../assets/images/productDetail/product-detail-bg.png'
import useQueryParams from '../../../hooks/useQueryParams'
import type { CommentQueryParamsConfig } from '../../../configs/comment.config'
import { commentApi } from '../../../apis/shared/comment.api'
import type { CommentType } from '../../../types/comment.type'
import Input from '../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddComment, type TypeSChemaAddComment } from '../../../validation/comment'
import { toast } from 'react-toastify'
import { COMMET_MESSAGE } from '../../../constants/message'
import { userCommentApi } from '../../../apis/users/comment.api'
import AvatarDefault from '../../../assets/images/avatar-default.png'
import type { ProductQueryParamsConfig } from '../../../configs/product.config'
import ProductListSection from '../../../components/ProductListSection'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const params = useParams()
  const navigate = useNavigate()
  const queryPageProducts: ProductQueryParamsConfig = {}
  const product_id = Number(params.product_id)
  const [imagePrimary, setImagePrimary] = useState<string>('')

  const queryParams: CommentQueryParamsConfig = useQueryParams()
  const queryConfig: CommentQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 3
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schemaAddComment)
  })

  // --- Get Product --- //
  const getProduct = useQuery({
    queryKey: ['getProduct', product_id],
    queryFn: () => productApi.getProduct(product_id),
    staleTime: 30 * 60 * 1000,
    enabled: !!product_id
  })

  // --- Get Comments --- //
  const getComments = useInfiniteQuery({
    queryKey: ['getComments', product_id],
    queryFn: ({ pageParam = queryConfig.page }) =>
      commentApi.getComments(product_id, { ...queryConfig, page: pageParam }),
    enabled: !!product_id,
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Add Comment Mutation --- //
  const addCommentMutation = useMutation({
    mutationFn: (body: { product_id: number; content: string }) => userCommentApi.addComment(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['getComments', product_id])
      queryClient.invalidateQueries(['adminGetComments', product_id])
      setValue('content', '')
      toast.success(COMMET_MESSAGE.ADD_COMMENT_SUCCESS)
    },
    onError: (errors: any) => {
      const message = errors.response.data.message
      toast.warning(message)
    }
  })

  // --- Handle Submit Comment --- //
  const handleAddComment = handleSubmit((data: TypeSChemaAddComment) => {
    addCommentMutation.mutate({
      ...data,
      product_id
    })
  })

  // --- Handle Collapse --- //
  const handleCollapse = () => {
    const dataCached = queryClient.getQueryData<any>(['getComments', product_id])
    if (dataCached) {
      queryClient.setQueryData(['getComments', product_id], {
        ...dataCached,
        pages: [dataCached.pages[0]]
      })
    }
  }

  // --- Render Button --- //
  const renderButton = () => (
    <>
      <button className='absolute button-prev z-10 bg-white flex items-center justify-center rounded-full w-[40px] left-[1%] top-1/2 -translate-y-1/2 h-[40px]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z'
            fill='#1A1A1A'
          />
        </svg>
      </button>
      <button className='absolute button-next z-10 bg-white flex items-center justify-center rounded-full w-[40px] right-[1%] top-1/2 -translate-y-1/2 h-[40px]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M8.29492 16.59L12.8749 12L8.29492 7.41L9.70492 6L15.7049 12L9.70492 18L8.29492 16.59Z'
            fill='#1A1A1A'
          />
        </svg>
      </button>
    </>
  )

  const { data, hasNextPage, fetchNextPage, isFetching } = getComments

  const product = useMemo(() => {
    if (!getProduct.data?.data) return
    if (getProduct.data.data) {
      const image = getProduct.data.data.data.image
      setImagePrimary(image)
      return getProduct.data.data as GetProductResponseSuccess
    }
  }, [product_id, getProduct.data?.data])

  const comments = useMemo(() => {
    if (!getComments.data?.pages) return
    return getComments.data.pages.flatMap((page) => page.data.data.comments) as CommentType[]
  }, [product_id, getComments.data?.pages])

  return (
    <>
      <div className='relative'>
        {/* Breadcrumbs */}
        <div className='bg-white w-full pt-[80px] md:pt-[85px]'>
          <div className='max-w-7xl px-4 mx-auto py-5 flex flex-wrap gap-3 items-center text-[14px] md:text-[15px]'>
            {/* block 1 */}
            <Link to={PATH.HOME} className='flex items-center gap-2'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M11.7348 8.25844L5.3336 13.5306V19.2208C5.3336 19.3681 5.39212 19.5094 5.4963 19.6136C5.60048 19.7178 5.74178 19.7763 5.88911 19.7763L9.77978 19.7662C9.92663 19.7655 10.0672 19.7067 10.1708 19.6026C10.2744 19.4985 10.3325 19.3576 10.3325 19.2107V15.8877C10.3325 15.7404 10.391 15.5991 10.4952 15.4949C10.5994 15.3907 10.7407 15.3322 10.888 15.3322H13.1101C13.2574 15.3322 13.3987 15.3907 13.5029 15.4949C13.6071 15.5991 13.6656 15.7404 13.6656 15.8877V19.2083C13.6654 19.2814 13.6796 19.3538 13.7074 19.4214C13.7352 19.489 13.7761 19.5505 13.8277 19.6022C13.8793 19.654 13.9406 19.6951 14.0081 19.7231C14.0756 19.7511 14.148 19.7655 14.2211 19.7655L18.1104 19.7763C18.2577 19.7763 18.399 19.7178 18.5032 19.6136C18.6074 19.5094 18.6659 19.3681 18.6659 19.2208V13.5268L12.266 8.25844C12.1908 8.1978 12.0971 8.16473 12.0004 8.16473C11.9038 8.16473 11.8101 8.1978 11.7348 8.25844ZM21.8462 11.8418L18.9437 9.44933V4.64032C18.9437 4.52982 18.8998 4.42385 18.8216 4.34572C18.7435 4.26758 18.6375 4.22369 18.527 4.22369H16.5827C16.4722 4.22369 16.3663 4.26758 16.2881 4.34572C16.21 4.42385 16.1661 4.52982 16.1661 4.64032V7.16131L13.0577 4.60387C12.7593 4.35839 12.385 4.22418 11.9987 4.22418C11.6124 4.22418 11.2381 4.35839 10.9398 4.60387L2.1512 11.8418C2.10901 11.8767 2.07411 11.9196 2.04848 11.9679C2.02286 12.0163 2.00701 12.0692 2.00185 12.1237C1.9967 12.1782 2.00232 12.2332 2.01842 12.2855C2.03451 12.3378 2.06076 12.3864 2.09565 12.4286L2.981 13.5049C3.0158 13.5472 3.0586 13.5823 3.10696 13.608C3.15532 13.6338 3.20828 13.6497 3.26282 13.655C3.31735 13.6602 3.37239 13.6547 3.42477 13.6387C3.47716 13.6226 3.52587 13.5964 3.56811 13.5615L11.7348 6.83494C11.8101 6.7743 11.9038 6.74123 12.0004 6.74123C12.0971 6.74123 12.1908 6.7743 12.266 6.83494L20.4331 13.5615C20.4753 13.5964 20.5239 13.6226 20.5762 13.6387C20.6286 13.6548 20.6835 13.6605 20.738 13.6553C20.7925 13.6501 20.8455 13.6343 20.8938 13.6087C20.9422 13.5831 20.985 13.5481 21.0199 13.506L21.9052 12.4297C21.9401 12.3872 21.9662 12.3384 21.9821 12.2858C21.998 12.2333 22.0034 12.1781 21.9979 12.1235C21.9924 12.0689 21.9762 12.0159 21.9502 11.9675C21.9241 11.9192 21.8888 11.8765 21.8462 11.8418Z'
                  fill='#4F46E5'
                />
              </svg>
              <span className='text-primary'>Trang chủ</span>
              <img src={ArrowRight} alt='' />
            </Link>
            {/* Block 2 */}
            <button
              onClick={() => {
                navigate(PATH.PRODUCT_LIST, {
                  state: {
                    queryPageProducts: {
                      ...queryPageProducts,
                      category: product?.data.category.id
                    }
                  }
                })
              }}
              className='flex items-center gap-2 hover:text-primary transition-all duration-100 ease-in-out'
            >
              <span>{product?.data.category.name}</span>
              <img src={ArrowRight} alt='' />
            </button>
            {/* Block 3 */}
            <button
              onClick={() => {
                navigate(PATH.PRODUCT_LIST, {
                  state: {
                    queryPageProducts: {
                      ...queryPageProducts,
                      category: product?.data.category.id,
                      brands: [product?.data.brand.id]
                    }
                  }
                })
              }}
              className='flex items-center gap-2 hover:text-primary transition-all duration-100 ease-in-out'
            >
              <span>{product?.data.brand.name}</span>
              <img src={ArrowRight} alt='' />
            </button>
            {/* Block 4 */}
            <div className='flex items-center gap-2'>
              <span className='leading-[1.5]'>{product?.data.name}</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <main className='w-full pt-4 mt-0 md:pt-0 md:mt-7 px-4 max-w-7xl mx-auto'>
          {/* Row 1 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-0 custom-sm:gap-4 lg:gap-6'>
            {/* Desktop */}
            <section className='hidden custom-sm:block p-4 lg:p-8 bg-white rounded-[10px]'>
              <div className='w-full sm:pt-[100%] relative'>
                <img
                  className='w-full sm:absolute top-0 left-0 sm:h-full rounded-[10px] object-cover'
                  src={imagePrimary}
                  alt={product?.data.name}
                />
              </div>
              <div className='mt-6 grid custom-sm:grid-cols-5 gap-4'>
                {product?.data.images &&
                  product.data.images.length > 0 &&
                  product.data.images.map((image, index) => (
                    <button
                      onMouseEnter={() => setImagePrimary(image)}
                      key={index}
                      className={`pt-[100%] relative rounded-[10px] border border-solid border-transparent ${imagePrimary === image && 'border-solid !border-primary '}`}
                    >
                      <img className='absolute top-0 left-0 rounded-[10px] object-cover' src={image} alt='image' />
                    </button>
                  ))}
              </div>
            </section>
            {/* Mobile */}
            <section className='block relative rounded-bl-none rounded-br-none rounded-[10px] custom-sm:hidden pb-4 md:p-8 bg-white'>
              <Swiper
                className='rounded-[10px]'
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={30}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 2800, disableOnInteraction: false }}
                navigation={{ nextEl: '.button-next', prevEl: '.button-prev' }}
              >
                {product?.data.images &&
                  product.data.images.length > 0 &&
                  product.data.images.map((image, index) => (
                    <SwiperSlide key={index} className='relative pt-[100%] pb-[40px] rounded-2xl'>
                      <img
                        className='absolute w-full top-0 left-0 rounded-[10px] object-cover'
                        src={image}
                        alt='image'
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              {/* Button điều hướng */}
              {renderButton()}
            </section>
            {/* Detail */}
            <section className='rounded-tl-none rounded-tr-none rounded-bl-[10px] rounded-br-[10px] px-4 pb-4 custom-sm:p-4 lg:p-8 flex flex-col bg-white custom-sm:rounded-[10px]'>
              <h2 className='custom_title_h2 leading-[1.5]'>{product?.data.name}</h2>
              {/* Rating */}
              <div className='flex items-center gap-3 mt-2 md:mt-3'>
                <div className='flex items-center gap-[6px]'>
                  <span className='block leading-[1.5] mt-[2px]'>{product?.data.rating}</span>
                  <div className='flex items-center'>
                    {Array.from({ length: Math.floor(Number(product?.data.rating)) }).map((_, index) => (
                      <svg
                        key={index}
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M12.0003 17.27L16.1503 19.78C16.9103 20.24 17.8403 19.56 17.6403 18.7L16.5403 13.98L20.2103 10.8C20.8803 10.22 20.5203 9.12 19.6403 9.05L14.8103 8.64L12.9203 4.18C12.5803 3.37 11.4203 3.37 11.0803 4.18L9.19032 8.63L4.36032 9.04C3.48032 9.11 3.12032 10.21 3.79032 10.79L7.46032 13.97L6.36032 18.69C6.16032 19.55 7.09032 20.23 7.85032 19.77L12.0003 17.27Z'
                          fill='#FFCC00'
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <div>|</div>
                <span className='mt-[1px]'>Đã bán {fomatNumberToSocialStyle(Number(product?.data.sold))}</span>
              </div>
              {/* Price */}
              <div className='flex items-center flex-wrap gap-4 mt-5'>
                <span className='text-[25px] font-semibold text-primary'>
                  {formatCurrency(Number(product?.data.price))}đ
                </span>
                {Number(product?.data.price_before_discount) > 0 && (
                  <>
                    <span className='text-[#666] font-medium text-[18px] line-through'>
                      {formatCurrency(Number(product?.data.price_before_discount))}đ
                    </span>
                    <span className='p-2 bg-[#E6E6E6] rounded-full font-medium text-[14px]'>
                      - {rateSale(Number(product?.data.price_before_discount), Number(product?.data.price))}
                    </span>
                  </>
                )}
              </div>
              {/* Action */}
              <div className='hidden md:flex mt-8 flex-col gap-4'>
                <button className='w-full rounded-[10px] font-semibold flex items-center justify-center gap-2 py-4 border border-solid border-primary text-primary'>
                  Thêm vào giỏ hàng
                  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='18' viewBox='0 0 20 18' fill='none'>
                    <path
                      d='M17.5249 11.1111H7.34625L7.57351 12.2222H16.8936C17.4283 12.2222 17.8247 12.7188 17.7062 13.2402L17.5146 14.0832C18.1636 14.3982 18.6111 15.0635 18.6111 15.8333C18.6111 16.9167 17.725 17.7932 16.6381 17.7776C15.6025 17.7627 14.7509 16.9223 14.723 15.8871C14.7077 15.3215 14.9342 14.809 15.3064 14.4444H8.02695C8.38726 14.7974 8.61111 15.2891 8.61111 15.8333C8.61111 16.938 7.69 17.8275 6.57396 17.7756C5.58299 17.7296 4.77705 16.9289 4.72497 15.9382C4.68476 15.1732 5.08733 14.4988 5.69896 14.1471L3.25983 2.22222H0.833334C0.37309 2.22222 0 1.84913 0 1.38889V0.833334C0 0.37309 0.37309 0 0.833334 0H4.39337C4.78924 0 5.13045 0.278507 5.20979 0.66632L5.52806 2.22222H19.1663C19.7011 2.22222 20.0974 2.71879 19.9789 3.24024L18.3375 10.4625C18.2513 10.8419 17.914 11.1111 17.5249 11.1111ZM14.1667 5.83333H12.5V4.44445C12.5 4.13761 12.2513 3.88889 11.9444 3.88889H11.3889C11.0821 3.88889 10.8333 4.13761 10.8333 4.44445V5.83333H9.16667C8.85983 5.83333 8.61111 6.08205 8.61111 6.38889V6.94445C8.61111 7.25129 8.85983 7.5 9.16667 7.5H10.8333V8.88889C10.8333 9.19573 11.0821 9.44445 11.3889 9.44445H11.9444C12.2513 9.44445 12.5 9.19573 12.5 8.88889V7.5H14.1667C14.4735 7.5 14.7222 7.25129 14.7222 6.94445V6.38889C14.7222 6.08205 14.4735 5.83333 14.1667 5.83333Z'
                      fill='#4F46E5'
                    />
                  </svg>
                </button>
                <button className='w-full rounded-[10px] font-semibold flex items-center justify-center bg-primary gap-2 py-4 border border-solid border-primary text-white'>
                  Mua ngay
                  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='18' viewBox='0 0 20 18' fill='none'>
                    <path
                      d='M17.5249 11.1111H7.34625L7.57351 12.2222H16.8936C17.4283 12.2222 17.8247 12.7188 17.7062 13.2402L17.5146 14.0832C18.1636 14.3982 18.6111 15.0635 18.6111 15.8333C18.6111 16.9167 17.725 17.7932 16.6381 17.7776C15.6025 17.7627 14.7509 16.9223 14.723 15.8871C14.7077 15.3215 14.9342 14.809 15.3064 14.4444H8.02695C8.38726 14.7974 8.61111 15.2891 8.61111 15.8333C8.61111 16.938 7.69 17.8275 6.57396 17.7756C5.58299 17.7296 4.77705 16.9289 4.72497 15.9382C4.68476 15.1732 5.08733 14.4988 5.69896 14.1471L3.25983 2.22222H0.833334C0.37309 2.22222 0 1.84913 0 1.38889V0.833334C0 0.37309 0.37309 0 0.833334 0H4.39337C4.78924 0 5.13045 0.278507 5.20979 0.66632L5.52806 2.22222H19.1663C19.7011 2.22222 20.0974 2.71879 19.9789 3.24024L18.3375 10.4625C18.2513 10.8419 17.914 11.1111 17.5249 11.1111ZM14.1667 5.83333H12.5V4.44445C12.5 4.13761 12.2513 3.88889 11.9444 3.88889H11.3889C11.0821 3.88889 10.8333 4.13761 10.8333 4.44445V5.83333H9.16667C8.85983 5.83333 8.61111 6.08205 8.61111 6.38889V6.94445C8.61111 7.25129 8.85983 7.5 9.16667 7.5H10.8333V8.88889C10.8333 9.19573 11.0821 9.44445 11.3889 9.44445H11.9444C12.2513 9.44445 12.5 9.19573 12.5 8.88889V7.5H14.1667C14.4735 7.5 14.7222 7.25129 14.7222 6.94445V6.38889C14.7222 6.08205 14.4735 5.83333 14.1667 5.83333Z'
                      fill='#4F46E5'
                    />
                  </svg>
                </button>
              </div>
              {/* Banner */}
              <div className='w-full mt-5 md:mt-5 lg:mt-10'>
                <img src={ProductDetailBg} className='object-cover w-full' alt='' />
              </div>
            </section>
          </div>
          {/* Row 2 */}
          <div className='mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start'>
            <section className='md:col-span-6 p-4 lg:p-8 bg-white rounded-[10px]'>
              <h2 className='custom_title_h2 mb-2 leading-[1.5]'>Giới thiệu về sản phẩm</h2>
              <div
                className='w-full text-wrap prose leading-normal max-w-none'
                dangerouslySetInnerHTML={{
                  __html: product?.data.description as string
                }}
              ></div>
            </section>
            <section className='md:col-span-6 p-4 lg:p-8 bg-white rounded-[10px]'>
              <h2 className='custom_title_h2 leading-[1.5]'>Thông tin cơ bản</h2>
              <ul className='mt-3 md:mt-6'>
                <li className='grid grid-cols-2 py-4 border-b border-solid border-[#E6E6E6]'>
                  <span className='font-medium'>Tên sản phẩm:</span>
                  <span className='leading-[1.5] font-medium text-primary'>{product?.data.name}</span>
                </li>
                <li className='grid grid-cols-2 py-4 border-b border-solid border-[#E6E6E6]'>
                  <span className='font-medium'>Thương hiệu:</span>
                  <span className='leading-[1.5] font-medium text-primary'>{product?.data.brand.name}</span>
                </li>
                {Number(product?.data.price_before_discount) > 0 && (
                  <>
                    <li className='grid grid-cols-2 py-4 border-b border-solid border-[#E6E6E6]'>
                      <span className='font-medium'>Khuyến mãi:</span>
                      <span className='leading-[1.5] font-medium'>
                        {rateSale(Number(product?.data.price_before_discount), Number(product?.data.price))}
                      </span>
                    </li>
                    <li className='grid grid-cols-2 py-4 border-b border-solid border-[#E6E6E6]'>
                      <span className='font-medium'>Giá bán gốc:</span>
                      <span className='leading-[1.5] font-medium'>
                        {formatCurrency(Number(product?.data.price_before_discount))}đ
                      </span>
                    </li>
                  </>
                )}
                <li className='grid grid-cols-2 py-4 border-b border-solid border-[#E6E6E6]'>
                  <span className='font-medium'>
                    {Number(product?.data.price_before_discount) > 0 ? 'Giá bán còn:' : 'Giá bán:'}
                  </span>
                  <span className='leading-[1.5] font-medium'>{formatCurrency(Number(product?.data.price))}đ</span>
                </li>
                <li className='grid grid-cols-2 py-4'>
                  <span className='font-medium'>Kho:</span>
                  <span className='leading-[1.5] font-medium'>
                    {Number(product?.data.stock) > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </li>
              </ul>
            </section>
          </div>
          {/* Row 3 */}
          <div className='mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start'>
            <section className='md:col-span-6 p-4 lg:p-8 bg-white rounded-[10px]'>
              <div className='pb-3 md:pb-5 border-b border-solid border-[#E6E6E6]'>
                <h2 className='custom_title_h2'>Đánh giá của khách hàng</h2>
                <div className='flex items-center gap-4 mt-5 md:mt-6'>
                  <span className='font-medium text-[25px] md:text-[30px] mt-1'>{product?.data.rating}</span>
                  <div className='flex items-center gap-3'>
                    {Array.from({ length: Math.floor(Number(product?.data.rating)) }).map((_, index) => (
                      <svg
                        key={index}
                        xmlns='http://www.w3.org/2000/svg'
                        width='30'
                        height='30'
                        viewBox='0 0 35 33'
                        fill='none'
                      >
                        <path
                          d='M17.1139 27.395L25.4139 32.415C26.9339 33.335 28.7939 31.975 28.3939 30.255L26.1939 20.815L33.5339 14.455C34.8739 13.295 34.1539 11.095 32.3939 10.955L22.7339 10.135L18.9539 1.215C18.2739 -0.405 15.9539 -0.405 15.2739 1.215L11.4939 10.115L1.83391 10.935C0.073915 11.075 -0.646085 13.275 0.693915 14.435L8.03391 20.795L5.83392 30.235C5.43392 31.955 7.29391 33.315 8.81391 32.395L17.1139 27.395Z'
                          fill='#FFCC00'
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className='mt-3 md:mt-5'>
                <h2 className='custom_title_h2 leading-[1.5]'>Tất cả các bình luận</h2>
                <div className='mt-4 flex flex-col gap-6'>
                  {comments &&
                    comments.map((comment: CommentType) => (
                      <div className='flex gap-4' key={comment.id}>
                        <div className='w-7 h-8 md:w-10 md:h-10'>
                          <img
                            className='w-full h-full object-cover rounded-full bg-teal-300'
                            src={comment.avatar || AvatarDefault}
                            alt='avatar'
                          />
                        </div>
                        <div className='flex-1 flex flex-col text-[14px] md:text-[15px]'>
                          <span className='font-medium'>{comment.full_name}</span>
                          <span className='mt-2 leading-[1.5] text-wrap'>{comment.content}</span>
                        </div>
                        <span className='ml-auto font-medium'>{formatTime(comment.createdAt)}</span>
                      </div>
                    ))}
                  {comments?.length === 0 && (
                    <span className='block text-[14px] md:text-[15px] text-center'>Không có bình luận nào.</span>
                  )}
                  {/* Pagination */}
                  <div className='flex justify-center items-center'>
                    {hasNextPage && (
                      <button
                        onClick={() => {
                          fetchNextPage()
                        }}
                        className='text-primary border border-solid border-primary rounded-md py-3 px-4 font-semibold'
                      >
                        {isFetching ? 'Đang tải...' : 'Xem thêm'}
                      </button>
                    )}
                    {!hasNextPage && (data?.pages.length as number) > 1 && (
                      <button
                        onClick={handleCollapse}
                        className='text-primary border border-solid border-primary rounded-md py-3 px-4 font-semibold'
                      >
                        {isFetching ? 'Đang tải...' : 'Đóng lại'}
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleAddComment}>
                    <Input
                      label=''
                      customHeight='h-12'
                      classNameLabel='block mb-2'
                      classNameError='mt-2 flex items-center gap-1'
                      classNameErrorMessage='text-red-500 text-[13px] leading-[1.5]'
                      classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                      register={register}
                      errorMessage={errors?.content?.message as string}
                      type='text'
                      name='content'
                      placeholder='Viết bình luận ...'
                      errors={errors.content}
                    />
                    <div className='w-full flex justify-end mt-4'>
                      <button className='ml-auto md:max-w-[200px] text-white bg-primary font-medium rounded-lg px-4 py-3 text-center'>
                        Bình luận
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </main>
        {/* Related Product */}
        <div className='mt-4 md:mt-6'>
          <ProductListSection title='Có thể bạn quan tâm' background='white' />
        </div>
      </div>
      {/* Action Add Cart On Mobile */}
      <div className='flex md:hidden z-30 fixed w-full bottom-0 p-4 border-t [box-shadow:0_-1px_8px_0_rgba(0,_0,_0,_0.15)] border-[#E6E6E6] bg-white  justify-between gap-3'>
        <button className='w-full rounded-[10px] font-semibold py-3 border border-solid border-primary text-primary'>
          Thêm vào giỏ hàng
        </button>
        <button className='w-full rounded-[10px] font-semibold bg-primary py-3 border border-solid border-primary text-white'>
          Mua ngay
        </button>
      </div>
    </>
  )
}
