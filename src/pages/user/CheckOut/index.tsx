import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import ArrowRight from '../../../assets/icons/arrow-right.svg'
import { formatCurrency } from '../../../utils/other'
import type { CartType } from '../../../types/cart.type'
import CheckOutItem from '../../../components/CheckOutItem'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userAddressApi } from '../../../apis/users/address.api'
import type { AddressType } from '../../../types/address.type'
import InputAuth from '../../../components/InputAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddAddress, type TypeSchemaAddAddress } from '../../../validation/address'
import { toast } from 'react-toastify'
import { ADDRESS_MESSAGE, ORDER_MESSAGE } from '../../../constants/message'
import { userOrderApi } from '../../../apis/users/order.api'
import { AppContext } from '../../../contexts/app.context'
import { saveSelectedCartIds } from '../../../utils/auth'

export default function CheckOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setSelectedCartIds } = useContext(AppContext)
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schemaAddAddress),
    defaultValues: {
      address: '',
      full_name: '',
      phone: ''
    }
  })
  const [addressId, setAddressId] = useState<number | undefined>(undefined)
  const [isModalAddAddressOpen, setIsModalAddAddressOpen] = useState<boolean>(false)
  const cartItems = (location.state?.cartItems as CartType[]) || []

  // --- Get Address --- //
  const getAddress = useQuery({
    queryKey: ['getAddress'],
    queryFn: () => userAddressApi.getAddresses(),
    staleTime: 30 * 60 * 1000
  })

  // --- Add Address Mutation --- //
  const addAddressMutation = useMutation({
    mutationFn: (body: TypeSchemaAddAddress) => userAddressApi.addAddress(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['getAddress'])
      reset()
      toast.success(ADDRESS_MESSAGE.ADD_ADDRESS_SUCCESS)
    }
  })

  // --- Add Order Mutation --- //
  const addOrderMutation = useMutation({
    mutationFn: (body: { address_id: number; cart_ids: number[]; total_price: number }) => userOrderApi.addOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['getCarts'])
      setSelectedCartIds([])
      saveSelectedCartIds([])
      toast.success(ORDER_MESSAGE.ADD_ORDER_SUCCESS)
      navigate(PATH.USER_ORDER_SUCCESS)
    }
  })

  // --- Handle Submit Add Address --- //
  const handleSubmitAddAdress = handleSubmit((data: TypeSchemaAddAddress) => {
    ;(addAddressMutation.mutate(data), setIsModalAddAddressOpen(false))
  })

  // --- Handle Submit Add Order --- //
  const handleSubmitAddOrder = () => {
    if (addressId === undefined || addressId === null || !addressId) {
      toast.warning(ORDER_MESSAGE.ADD_ADDRESS_FIRST)
      return
    }

    const cartIds = cartItems.map((cart) => cart.id)

    addOrderMutation.mutate({
      address_id: addressId as number,
      cart_ids: cartIds,
      total_price: totalPrice
    })
  }

  // --- Close Modal Add Address --- //
  const handleCloseModalAddAddress = () => {
    setIsModalAddAddressOpen(false)
    reset()
  }

  // --- Xử lý khi người dùng cố tình sang trang Check Out khi chưa chọn sản phẩm --- //
  useEffect(() => {
    if (!cartItems || cartItems.length <= 0) {
      toast.warning(ORDER_MESSAGE.CART_EMPTY)
      navigate(PATH.HOME)
      return
    }
  }, [cartItems])

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, cart) => total + cart.price * cart.quantity, 0)
  }, [cartItems])

  const addresses = useMemo(() => {
    return (getAddress.data?.data && (getAddress.data.data.data.addresses as AddressType[])) || []
  }, [getAddress.data?.data])

  const fullName = watch('full_name')
  const phone = watch('phone')
  const address = watch('address')
  const isDisable = fullName.trim() === '' || phone?.trim() === '' || address?.trim() === ''

  return (
    <div>
      <div className='relative min-h-[calc(100vh-80px)] sm:min-h-[540px]'>
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
            <div className='flex items-center gap-2'>
              <span className='leading-[1.5]'>Tiến hành thanh toán</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <main className='w-full px-4 max-w-7xl mx-auto grid grid-cols-12 gap-4 pt-4 md:pt-7'>
          <section className='col-span-12 lg:col-span-8'>
            <div>
              {/* Title Quantity */}
              <h2 className='custom_title_h2'>Sản phẩm trong đơn ({cartItems.length})</h2>
              {/* Carts List */}
              <div className=''>
                {cartItems && cartItems.map((cart: CartType) => <CheckOutItem cart={cart} key={cart.id} />)}
              </div>
            </div>
            <div className='mt-5 md:mt-10'>
              {/* Title Quantity */}
              <div className='flex items-center justify-between'>
                <h2 className='custom_title_h2'>Địa chỉ nhận hàng</h2>
                <button
                  onClick={() => setIsModalAddAddressOpen(true)}
                  className='flex items-center leading-[1.5] gap-2 text-primary font-semibold'
                >
                  Thêm địa chỉ mới
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M18.5714 7.85714H12.1429V1.42857C12.1429 0.639732 11.5031 0 10.7143 0H9.28571C8.49687 0 7.85714 0.639732 7.85714 1.42857V7.85714H1.42857C0.639732 7.85714 0 8.49687 0 9.28571V10.7143C0 11.5031 0.639732 12.1429 1.42857 12.1429H7.85714V18.5714C7.85714 19.3603 8.49687 20 9.28571 20H10.7143C11.5031 20 12.1429 19.3603 12.1429 18.5714V12.1429H18.5714C19.3603 12.1429 20 11.5031 20 10.7143V9.28571C20 8.49687 19.3603 7.85714 18.5714 7.85714Z'
                      fill='#4F46E5'
                    />
                  </svg>
                </button>
              </div>
              {/* Address List */}
              {addresses && addresses.length > 0 ? (
                <div className='bg-white py-4 px-2 md:px-4 mt-4 md:mt-6 rounded-[10px] gap-4 grid grid-cols-1 md:grid-cols-2'>
                  {addresses.map((address: AddressType) => (
                    <div
                      key={address.id}
                      onClick={() => setAddressId(address.id)}
                      className={`cursor-pointer bg-white p-4 md:p-4 flex items-center gap-4 border border-solid border-[#E6E6E6] rounded-[10px] ${address.id === addressId && 'border-[#EAE9FC] !bg-[#EAE9FC]'}`}
                    >
                      <input
                        checked={address.id === addressId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setAddressId(address.id)
                          }
                        }}
                        className='cursor-pointer'
                        type='checkbox'
                        name=''
                        id=''
                      />
                      <div className='flex flex-col gap-2'>
                        <h3 className='font-semibold'>{address.full_name}</h3>
                        <p className='leading-[1.5]'>{address.address}</p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center mt-12'>
                  <span>Bạn chưa có địa chỉ nhận hàng, vui lòng thêm điểm nhận hàng.</span>
                </div>
              )}
            </div>
          </section>
          <section className='col-span-12 lg:col-span-4'>
            <div className='bg-white py-4 px-3 md:px-4 rounded-[10px]'>
              <h3 className='font-semibold md:text-[17px]'>Thông tin đơn hàng</h3>
              <ul className='my-4'>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Tạm tính</span>
                  <span className='font-medium'>{formatCurrency(totalPrice)}đ</span>
                </li>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Khuyến mãi </span>
                  <span className='font-medium'>0đ</span>
                </li>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Thành tiền</span>
                  <span className='block text-primary font-semibold md:text-[18px]'>{formatCurrency(totalPrice)}đ</span>
                </li>
              </ul>
              <button
                type='submit'
                onClick={() => handleSubmitAddOrder()}
                className='w-full bg-primary hover:bg-blue-700 mt-1 text-white py-3 rounded-lg font-medium transition'
              >
                Đặt hàng
              </button>
            </div>
          </section>
        </main>
      </div>
      <div
        className={`cursor-pointer fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${isModalAddAddressOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => {
          handleCloseModalAddAddress()
        }}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation()
          }}
          className='min-w-[315px] custom-sm:min-w-[450px] bg-white rounded-[10px]'
        >
          <div className='flex items-center py-3 px-4 sm:py-4 sm:px-6 border-b border-solid border-[#E6E6E6]'>
            <span className='text-center ml-[45px] flex-1 block font-semibold sm:text-[17px] text-[#333]'>
              Địa chỉ mới
            </span>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation()
                handleCloseModalAddAddress()
              }}
              className='ml-auto bg-[#EAE9FC] block p-3.5 rounded-[50%]'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='17' height='15' viewBox='0 0 17 15' fill='none'>
                <path
                  d='M15.1042 0H1.5625C0.69987 0 0 0.69987 0 1.5625V13.0208C0 13.8835 0.69987 14.5833 1.5625 14.5833H15.1042C15.9668 14.5833 16.6667 13.8835 16.6667 13.0208V1.5625C16.6667 0.69987 15.9668 0 15.1042 0ZM12.3828 9.45638C12.5391 9.61263 12.5391 9.86654 12.3828 10.0228L11.0645 11.3411C10.9082 11.4974 10.6543 11.4974 10.498 11.3411L8.33333 9.1569L6.16862 11.3411C6.01237 11.4974 5.75846 11.4974 5.60221 11.3411L4.28385 10.0228C4.1276 9.86654 4.1276 9.61263 4.28385 9.45638L6.4681 7.29167L4.28385 5.12695C4.1276 4.9707 4.1276 4.7168 4.28385 4.56055L5.60221 3.24219C5.75846 3.08594 6.01237 3.08594 6.16862 3.24219L8.33333 5.42643L10.498 3.24219C10.6543 3.08594 10.9082 3.08594 11.0645 3.24219L12.3828 4.56055C12.5391 4.7168 12.5391 4.9707 12.3828 5.12695L10.1986 7.29167L12.3828 9.45638Z'
                  fill='#4F46E5'
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmitAddAdress}>
            <div className='px-4 py-5 sm:py-6 sm:px-6 flex flex-col gap-4'>
              <InputAuth
                label='Họ và tên khách hàng'
                classNameLabel='block mb-2'
                classNameError='mt-2 flex items-center gap-1'
                classNameErrorMessage='text-red-500 text-[13px]'
                classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                register={register}
                errorMessage={errors?.full_name?.message as string}
                type='text'
                name='full_name'
                errors={errors.full_name}
              />
              <InputAuth
                label='Số điện thoại'
                classNameLabel='block mb-2'
                classNameError='mt-2 flex items-center gap-1'
                classNameErrorMessage='text-red-500 text-[13px]'
                classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                register={register}
                errorMessage={errors?.phone?.message as string}
                type='text'
                name='phone'
                errors={errors.phone}
              />
              <div className=''>
                <label className='block mb-2'>Địa chỉ</label>
                <textarea
                  {...register('address')}
                  onInput={(e) => {
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.style.height = 'auto'
                    textarea.style.height = `${textarea.scrollHeight}px`
                  }}
                  className='text-[14px] md:text-[15px] leading-[1.5] min-h-[70px] w-full border border-solid border-[#B3B3B3] bg-transparent rounded-lg py-2 px-3 h-[80px] sm:h-[60px] focus:ring-2 focus:ring-blue-500 outline-none resize-none'
                ></textarea>
              </div>
            </div>
            <div className='flex gap-3 p-4 sm:px-6'>
              <button
                disabled={isDisable}
                className={`${isDisable && 'opacity-50 cursor-not-allowed'} rounded-[8px] font-semibold py-3 flex-1 flex bg-primary text-white items-center justify-center border border-solid border-primary`}
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
