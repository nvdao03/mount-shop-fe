import { Link } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import ArrowRight from '../../../assets/icons/arrow-right.svg'
import CartItem from '../../../components/CartItem'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userCartApi } from '../../../apis/users/cart.api'
import type { CartType } from '../../../types/cart.type'
import { useMemo, useState } from 'react'
import { formatCurrency } from '../../../utils/other'
import { toast } from 'react-toastify'
import { CART_MESSAGE } from '../../../constants/message'
import CartEmptyImage from '../../../assets/images/cart/cart-empty-img.png'

export default function Cart() {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)
  const [isCartSumaryModal, setIsCartSumaryModal] = useState<boolean>(false)
  const [imageDelete, setImageDelete] = useState<string>('')
  const [cartId, setCartId] = useState<number | undefined>(undefined)

  // --- Get Carts ---
  const getCarts = useQuery({
    queryKey: ['getCarts'],
    queryFn: () => userCartApi.getCarts(),
    keepPreviousData: true,
    staleTime: 30 * 60 * 1000
  })

  // --- Check box cart ---
  const handleSelect = (cart_id: number) => {
    setSelectedIds((prev) => {
      return prev.includes(cart_id) ? prev.filter((id) => id !== cart_id) : [...prev, cart_id]
    })
  }

  // --- Check box cart all ---
  const handleSelectAll = () => {
    if (carts.length === selectedIds.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(carts.map((cart) => cart.id))
    }
  }

  // --- Delete Cart Mutation ---
  const deleteCartMutation = useMutation({
    mutationFn: (cart_id: number) => userCartApi.deleteCart(cart_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['getCarts'])
    }
  })

  // --- Delete cart ---
  const handleDeleteCart = (cart_id: number) => {
    deleteCartMutation.mutate(cart_id)
  }

  // --- Delete all cart ---
  const handleDeleteSelectAll = async () => {
    if (selectedIds.length <= 0) return
    await Promise.all(selectedIds.map((cart_id) => deleteCartMutation.mutateAsync(cart_id)))
    setSelectedIds([])
    toast.success(CART_MESSAGE.DELETE_CART_SUCCESS)
  }

  // --- Close modal delete ---
  const handleCloseModalDelete = () => {
    setImageDelete('')
    setCartId(undefined)
    setIsModalDeleteOpen(false)
  }

  const total = getCarts.data?.data && (getCarts.data.data.data.total as number)
  const carts = (getCarts.data?.data && (getCarts.data.data.data.carts as CartType[])) || []
  const totalPrice = useMemo(() => {
    return carts
      .filter((cart) => selectedIds.includes(cart.id))
      .reduce((total, cart) => total + cart.price * cart.quantity, 0)
  }, [selectedIds, carts])

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
              <span className='leading-[1.5]'>Giỏ hàng</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <main className='w-full px-4 max-w-7xl mx-auto grid grid-cols-12 md:gap-4 pt-4 md:pt-7'>
          <section className='col-span-12 lg:col-span-9'>
            {/* Title Quantity */}
            <h2 className='custom_title_h2'>Giỏ hàng của bạn ({total})</h2>
            {/* List Cart */}
            {carts.length > 0 && (
              <>
                {/* Input check all */}
                <div className='flex justify-between items-center py-4 px-2 md:px-4 bg-white mt-4 md:mt-6 rounded-[10px]'>
                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='cart-all'
                      onChange={handleSelectAll}
                      checked={selectedIds.length === carts.length}
                    />
                    <label htmlFor='cart-all' className='select-none cursor-pointer'>
                      Chọn tất cả
                    </label>
                  </div>
                  <button onClick={handleDeleteSelectAll}>
                    <svg
                      className='w-[16px] h-[16px] md:w-[18px] md:h-[18px]'
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      height='20'
                      viewBox='0 0 18 20'
                      fill='none'
                    >
                      <path
                        d='M1.25 18.125C1.25 18.6223 1.44754 19.0992 1.79917 19.4508C2.1508 19.8025 2.62772 20 3.125 20H14.375C14.8723 20 15.3492 19.8025 15.7008 19.4508C16.0525 19.0992 16.25 18.6223 16.25 18.125V5H1.25V18.125ZM11.875 8.125C11.875 7.95924 11.9408 7.80027 12.0581 7.68306C12.1753 7.56585 12.3342 7.5 12.5 7.5C12.6658 7.5 12.8247 7.56585 12.9419 7.68306C13.0591 7.80027 13.125 7.95924 13.125 8.125V16.875C13.125 17.0408 13.0591 17.1997 12.9419 17.3169C12.8247 17.4342 12.6658 17.5 12.5 17.5C12.3342 17.5 12.1753 17.4342 12.0581 17.3169C11.9408 17.1997 11.875 17.0408 11.875 16.875V8.125ZM8.125 8.125C8.125 7.95924 8.19085 7.80027 8.30806 7.68306C8.42527 7.56585 8.58424 7.5 8.75 7.5C8.91576 7.5 9.07473 7.56585 9.19194 7.68306C9.30915 7.80027 9.375 7.95924 9.375 8.125V16.875C9.375 17.0408 9.30915 17.1997 9.19194 17.3169C9.07473 17.4342 8.91576 17.5 8.75 17.5C8.58424 17.5 8.42527 17.4342 8.30806 17.3169C8.19085 17.1997 8.125 17.0408 8.125 16.875V8.125ZM4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5C5.16576 7.5 5.32473 7.56585 5.44194 7.68306C5.55915 7.80027 5.625 7.95924 5.625 8.125V16.875C5.625 17.0408 5.55915 17.1997 5.44194 17.3169C5.32473 17.4342 5.16576 17.5 5 17.5C4.83424 17.5 4.67527 17.4342 4.55806 17.3169C4.44085 17.1997 4.375 17.0408 4.375 16.875V8.125ZM16.875 1.25001H12.1875L11.8203 0.519538C11.7425 0.363372 11.6227 0.232008 11.4743 0.140225C11.326 0.0484421 11.1549 -0.00011828 10.9805 6.84872e-06H6.51562C6.34155 -0.000662313 6.17081 0.047717 6.02297 0.139602C5.87512 0.231487 5.75615 0.363161 5.67969 0.519538L5.3125 1.25001H0.625C0.45924 1.25001 0.300268 1.31585 0.183058 1.43306C0.065848 1.55027 0 1.70925 0 1.87501L0 3.12501C0 3.29077 0.065848 3.44974 0.183058 3.56695C0.300268 3.68416 0.45924 3.75001 0.625 3.75001H16.875C17.0408 3.75001 17.1997 3.68416 17.3169 3.56695C17.4341 3.44974 17.5 3.29077 17.5 3.12501V1.87501C17.5 1.70925 17.4341 1.55027 17.3169 1.43306C17.1997 1.31585 17.0408 1.25001 16.875 1.25001Z'
                        fill='#FF3B30'
                      />
                    </svg>
                  </button>
                </div>
                {/* Carts List */}
                <div className=''>
                  {carts &&
                    carts.map((cart: CartType) => (
                      <CartItem
                        setIsModalDeleteOpen={setIsModalDeleteOpen}
                        setImageDelete={setImageDelete}
                        setCartId={setCartId}
                        selectedIds={selectedIds}
                        handleSelect={handleSelect}
                        cart={cart}
                        key={cart.id}
                      />
                    ))}
                </div>
              </>
            )}
          </section>
          {carts.length > 0 && (
            <section className='hidden lg:block lg:col-span-3'>
              <div className='bg-white md:p-4 rounded-[10px]'>
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
                    <span className='block text-primary font-semibold md:text-[18px]'>
                      {formatCurrency(totalPrice)}đ
                    </span>
                  </li>
                </ul>
                <button className='w-full bg-primary hover:bg-blue-700 mt-1 text-white py-3 rounded-lg font-medium transition'>
                  Tiến hành thanh toán
                </button>
              </div>
            </section>
          )}
        </main>
        {/* Cart Empty */}
        {carts.length === 0 && (
          <div className='w-full h-[calc(100vh-250px)] flex flex-col gap-6 items-center justify-center text-[20px]'>
            <img src={CartEmptyImage} alt='' />
            <span className='font-semibold mx-auto text-center text-[15px] md:text-[18px]'>Giỏ hàng trống </span>
          </div>
        )}
      </div>
      {/* Action Add Cart On Mobile */}
      {carts.length > 0 && (
        <div className='flex lg:hidden z-30 fixed w-full bottom-0 p-4 border-t [box-shadow:0_-1px_8px_0_rgba(0,_0,_0,_0.15)] border-[#E6E6E6] bg-white justify-between gap-4'>
          <button
            onClick={() => setIsCartSumaryModal(true)}
            className='w-full flex items-center justify-between sm:justify-normal gap-2 bg-white rounded-[10px] py-2'
          >
            <div className='flex justify-start flex-col items-start gap-2'>
              <span className='text-[#1A1A1A] font-normal'>Tổng tiền</span>
              <span className='block text-primary font-semibold text-[16px]'>{formatCurrency(totalPrice)}đ</span>
            </div>
            <button className='sm:ml-10'>
              <svg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9' fill='none'>
                <path
                  d='M5.96228 8.31718L0.293842 2.64874C-0.0979473 2.25696 -0.0979473 1.62342 0.293842 1.2358L1.2358 0.293842C1.62759 -0.0979473 2.26112 -0.0979473 2.64874 0.293842L6.66667 4.31176L10.6846 0.293842C11.0764 -0.0979473 11.7099 -0.0979473 12.0975 0.293842L13.0395 1.2358C13.4313 1.62759 13.4313 2.26112 13.0395 2.64874L7.37105 8.31718C6.9876 8.70897 6.35407 8.70897 5.96228 8.31718V8.31718Z'
                  fill='#1A1A1A'
                />
              </svg>
            </button>
          </button>
          <button className='w-full rounded-[10px] font-semibold bg-primary py-2 border border-solid border-primary text-white'>
            Tiến hành thanh toán
          </button>
        </div>
      )}
      {/* Modal Delete Cart */}
      <div
        className={`cursor-pointer fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${isModalDeleteOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => handleCloseModalDelete()}
      >
        <div className='min-w-[315px] custom-sm:min-w-[400px] bg-white rounded-[10px]'>
          <div className='flex items-center py-3 px-4 sm:py-4 sm:px-6 border-b border-solid border-[#E6E6E6]'>
            <span className='text-center ml-[45px] flex-1 block font-semibold sm:text-[17px] text-[#333]'>
              Xác nhận
            </span>
            <button onClick={() => handleCloseModalDelete()} className='ml-auto bg-[#EAE9FC] block p-3.5 rounded-[50%]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='17' height='15' viewBox='0 0 17 15' fill='none'>
                <path
                  d='M15.1042 0H1.5625C0.69987 0 0 0.69987 0 1.5625V13.0208C0 13.8835 0.69987 14.5833 1.5625 14.5833H15.1042C15.9668 14.5833 16.6667 13.8835 16.6667 13.0208V1.5625C16.6667 0.69987 15.9668 0 15.1042 0ZM12.3828 9.45638C12.5391 9.61263 12.5391 9.86654 12.3828 10.0228L11.0645 11.3411C10.9082 11.4974 10.6543 11.4974 10.498 11.3411L8.33333 9.1569L6.16862 11.3411C6.01237 11.4974 5.75846 11.4974 5.60221 11.3411L4.28385 10.0228C4.1276 9.86654 4.1276 9.61263 4.28385 9.45638L6.4681 7.29167L4.28385 5.12695C4.1276 4.9707 4.1276 4.7168 4.28385 4.56055L5.60221 3.24219C5.75846 3.08594 6.01237 3.08594 6.16862 3.24219L8.33333 5.42643L10.498 3.24219C10.6543 3.08594 10.9082 3.08594 11.0645 3.24219L12.3828 4.56055C12.5391 4.7168 12.5391 4.9707 12.3828 5.12695L10.1986 7.29167L12.3828 9.45638Z'
                  fill='#4F46E5'
                />
              </svg>
            </button>
          </div>
          <div className='px-4 py-5 sm:py-6 sm:px-6'>
            <div className='w-[80px] h-[80px] text-center mx-auto'>
              <img className='object-cover rounded-[5px]' src={imageDelete} alt='' />
            </div>
            <span className='block text-center text-[14px] sm:text-[16px] font-medium mt-5'>
              Bạn có muốn xóa sản phẩm này không?
            </span>
          </div>
          <div className='flex gap-3 p-4 sm:px-6'>
            <button
              onClick={() => handleCloseModalDelete()}
              className='rounded-[8px] font-semibold py-3 bg-white text-primary flex-1 flex items-center justify-center border border-solid border-primary'
            >
              Huỷ
            </button>
            <button
              onClick={() => {
                if (cartId === undefined) return
                handleDeleteCart(cartId)
                toast.success(CART_MESSAGE.DELETE_CART_SUCCESS)
              }}
              className='rounded-[8px] font-semibold py-3 flex-1 flex bg-primary text-white items-center justify-center border border-solid border-primary'
            >
              Xoá
            </button>
          </div>
        </div>
      </div>
      {/* Modal Cart Summary */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end lg:hidden transition-opacity duration-500 ease-in-out ${
          isCartSumaryModal ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsCartSumaryModal(false)}
      >
        <div
          className={`flex flex-col w-full h-[45%] bg-white shadow-lg rounded-t-2xl transition-all transform duration-500 ease-out ${
            isCartSumaryModal ? ' translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}
        >
          {/* --- Header --- */}
          <div className='px-4 py-3 flex items-center gap-3 border-b border-solid border-[#E6E6E6]'>
            <button
              onClick={() => setIsCartSumaryModal(false)}
              className='flex justify-center items-center bg-[#EAE9FC] p-2.5 rounded-full'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 18 12' fill='none'>
                <path
                  d='M8.11984 11.0146L1.03429 3.92909C0.544558 3.43936 0.544558 2.64744 1.03429 2.16292L2.21175 0.985466C2.70148 0.49573 3.4934 0.49573 3.97792 0.985466L9.00033 6.00787L14.0227 0.985466C14.5125 0.49573 15.3044 0.49573 15.7889 0.985466L16.9664 2.16292C17.4561 2.65265 17.4561 3.44457 16.9664 3.92909L9.88081 11.0146C9.40149 11.5044 8.60958 11.5044 8.11984 11.0146V11.0146Z'
                  fill='#4F46E5'
                />
              </svg>
            </button>
          </div>
          {/* --- Nội dung --- */}
          <div className='flex-1 overflow-y-auto p-4'>
            <h3 className='font-semibold text-[16px] md:text-[17px]'>Thông tin đơn hàng</h3>
            <ul className='my-4'>
              <li className='flex items-center justify-between py-4 border-b border-solid border-[#E6E6E6]'>
                <span>Tạm tính</span>
                <span className='font-medium'>{formatCurrency(totalPrice)}đ</span>
              </li>
              <li className='flex items-center justify-between py-4 border-b border-solid border-[#E6E6E6]'>
                <span>Khuyến mãi </span>
                <span className='font-medium'>0đ</span>
              </li>
              <li className='flex items-center justify-between py-4 border-b border-solid border-[#E6E6E6]'>
                <span>Thành tiền</span>
                <span className='block text-primary font-semibold md:text-[18px]'>{formatCurrency(totalPrice)}đ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
