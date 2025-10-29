import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CartType } from '../../types/cart.type'
import { formatCurrency, rateSale } from '../../utils/other'
import { userCartApi } from '../../apis/users/cart.api'
import { toast } from 'react-toastify'
import { CART_MESSAGE } from '../../constants/message'

interface PropTypes {
  cart: CartType
  selectedIds: number[]
  handleSelect: (cart_id: number) => void
  setIsModalDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  setImageDelete: React.Dispatch<React.SetStateAction<string>>
  setCartId: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default function CartItem({
  cart,
  handleSelect,
  selectedIds,
  setImageDelete,
  setIsModalDeleteOpen,
  setCartId
}: PropTypes) {
  const queryClient = useQueryClient()

  // --- Update Cart Mutation --- //
  const updateCartMutation = useMutation({
    mutationFn: ({ cart_id, quantity }: { cart_id: number; quantity: number }) =>
      userCartApi.updateCart(cart_id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['getCarts'])
      toast.success(CART_MESSAGE.UPDATE_CART_SUCCESS)
    }
  })

  return (
    <div className='mt-2 md:mt-4 bg-white py-4 px-2 md:px-4 rounded-[10px] flex flex-col md:gap-8 md:flex md:flex-row md:items-center md:justify-between'>
      {/* Block left */}
      <div className='flex items-start sm:items-center gap-4 lg:w-[70%]'>
        <input
          className='cursor-pointer'
          type='checkbox'
          onChange={() => handleSelect(cart.id)}
          checked={selectedIds.includes(cart.id)}
        />
        <div className='flex gap-3 md:gap-4'>
          <div className='flex-shrink-0 w-[80px] h-[80px]'>
            <img className='flex-shrink-0 rounded-[5px] object-cover' src={cart.image} alt={cart.name} />
          </div>
          <div className='flex flex-col gap-3 md:flex md:flex-col md:justify-around md:gap-2'>
            <h3 className='font-semibold text-[16px] leading-[1.5] md:text-[16px]'>{cart.name}</h3>
            <div className='text-[14px]'>
              <span className='block leading-[1.5]'>Thương hiệu: {cart.brand}</span>
            </div>
            <div className='flex items-center flex-wrap gap-2'>
              <span className='text-[18px] sm:text-[19px] font-semibold text-primary'>
                {formatCurrency(cart.price)}đ
              </span>
              {Number(cart.price_before_discount) > 0 && (
                <div className='flex items-center gap-3 sm:gap-2'>
                  <span className='text-[#666] font-medium text-[15px] sm:text-[16px] line-through'>
                    {formatCurrency(cart.price_before_discount)}đ
                  </span>
                  <span className='p-1 bg-[#E6E6E6] rounded-full font-medium text-[11px] sm:text-[12px]'>
                    - {rateSale(Number(cart.price_before_discount), Number(cart.price))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Block right */}
      <div className='flex-shrink-0 flex items-center mt-6 lg:mt-0 gap-4'>
        <span>Số lượng</span>
        <div className='flex'>
          <button
            disabled={cart.quantity === 1}
            onClick={() => updateCartMutation.mutate({ cart_id: cart.id, quantity: cart.quantity - 1 })}
            className={`${cart.quantity === 1 && 'cursor-not-allowed'} flex justify-center items-center py-[8px] px-4 md:p-[16px] bg-primary font-semibold text-white rounded-tl-[100px] rounded-bl-[100px]`}
          >
            -
          </button>
          <span className='border border-solid border-[#E6E6E6] flex flex-shrink-0 justify-center items-center py-[8px] px-4 md:p-[14px] font-semibold'>
            {cart.quantity}
          </span>
          <button
            onClick={() => updateCartMutation.mutate({ cart_id: cart.id, quantity: cart.quantity + 1 })}
            className='flex justify-center items-center  py-[8px] px-4 md:p-[14px] bg-primary font-semibold text-white rounded-tr-[100px] rounded-br-[100px]'
          >
            +
          </button>
        </div>
        <button
          onClick={() => {
            setIsModalDeleteOpen(true)
            setImageDelete(cart.image)
            setCartId(cart.id)
          }}
          className='ml-auto md:ml-3'
        >
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
    </div>
  )
}
