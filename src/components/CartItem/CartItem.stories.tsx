import type { Meta, StoryObj } from '@storybook/react-vite'
import CartItem from './index'
import type { CartType } from '../../types/cart.type'
import { useState } from 'react'

const sameCart: CartType = {
  id: 64,
  quantity: 1,
  name: 'WF-P115VGT11 - Máy Giặt Sấy Casper Inverter 11.5/8 Kg P115VGT11 [TOÀN QUỐC]',
  image: 'https://mount-shop-s3.s3.ap-southeast-1.amazonaws.com/images/j4o3t3z1qtj2gaqn0m8099h0p.png',
  brand: 'Casper',
  price: 11317000,
  price_before_discount: 17390000,
  createdAt: '2025-10-31T17:11:58.782Z',
  updatedAt: '2025-10-31T17:11:58.782Z'
}

const meta: Meta<typeof CartItem> = {
  title: 'Mount Shop/CartItem',
  component: CartItem,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    cart: sameCart
  }
} satisfies Meta<typeof CartItem>

export default meta
type Story = StoryObj<typeof CartItem>

// Story mặc định
export const Default: Story = {
  render: (args) => {
    const [selectedCartIds, setSelectedCartIds] = useState<number[]>([])
    const [, setIsModalDeleteOpen] = useState(false)
    const [, setImageDelete] = useState('')
    const [, setCartId] = useState<number | undefined>(undefined)

    const handleSelect = (cart_id: number) => {
      setSelectedCartIds((prev) => {
        const cartIds = prev.includes(cart_id) ? prev.filter((id) => id !== cart_id) : [...prev, cart_id]
        return cartIds
      })
    }

    return (
      <div className='max-w-3xl w-full'>
        <CartItem
          {...args}
          setIsModalDeleteOpen={setIsModalDeleteOpen}
          setImageDelete={setImageDelete}
          setCartId={setCartId}
          selectedIds={selectedCartIds}
          handleSelect={handleSelect}
        />
      </div>
    )
  }
}

// Story khi click vào xoá sản phẩm
export const WithClickDelete: Story = {
  render: (args) => {
    const [selectedCartIds, setSelectedCartIds] = useState<number[]>([])
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
    const [imageDelete, setImageDelete] = useState('')
    const [, setCartId] = useState<number | undefined>(undefined)

    const handleSelect = (cart_id: number) => {
      setSelectedCartIds((prev) => {
        const cartIds = prev.includes(cart_id) ? prev.filter((id) => id !== cart_id) : [...prev, cart_id]
        return cartIds
      })
    }

    const handleCloseModalDelete = () => {
      setImageDelete('')
      setCartId(undefined)
      setIsModalDeleteOpen(false)
    }

    return (
      <>
        <div className='max-w-3xl w-full'>
          <CartItem
            {...args}
            setIsModalDeleteOpen={setIsModalDeleteOpen}
            setImageDelete={setImageDelete}
            setCartId={setCartId}
            selectedIds={selectedCartIds}
            handleSelect={handleSelect}
          />
        </div>
        <div
          className={`cursor-pointer fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${isModalDeleteOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={() => handleCloseModalDelete()}
        >
          <div className='min-w-[315px] custom-sm:min-w-[400px] bg-white rounded-[10px]'>
            <div className='flex items-center py-3 px-4 sm:py-4 sm:px-6 border-b border-solid border-[#E6E6E6]'>
              <span className='text-center ml-[45px] flex-1 block font-semibold sm:text-[17px] text-[#333]'>
                Xác nhận
              </span>
              <button
                onClick={() => handleCloseModalDelete()}
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
              <button className='rounded-[8px] font-semibold py-3 flex-1 flex bg-primary text-white items-center justify-center border border-solid border-primary'>
                Xoá
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }
}
