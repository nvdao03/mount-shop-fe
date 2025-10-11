import Logo from '../../assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '../../constants/path'
import Cart from '../../assets/icons/cart.svg'
import User from '../../assets/icons/user.svg'
import Notification from '../../assets/icons/notification.svg'
import CategoryIcon from '../../assets/icons/category.svg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '../../apis/shared/category.api'
import type { CategoryType } from '../../types/category.type'
import type { BrandType } from '../../types/brand.type'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import AvatarDefault from '../../assets/images/avatar-default.png'
import { getUsernameFromEmail } from '../../utils/other'
import { authApi } from '../../apis/shared/auth.api'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../constants/message'

export default function Header() {
  const { avatar, isAuthenticated, fullName, email, refreshToken, resetAppContext } = useContext(AppContext)
  const queryClient = useQueryClient()
  const navidate = useNavigate()

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<CategoryType | null>(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false)

  // --- Get All Category ---
  const getAllCategory = useQuery({
    queryKey: ['getAllCategory'],
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 30 * 60 * 1000
  })

  // --- Get Brands By Category Id ---
  const getBrandsByCategoryId = useQuery({
    queryKey: ['getBrandsByCategoryId', selectedCategoryId],
    queryFn: () => categoryApi.getBrandsByCategoryId(selectedCategoryId as number),
    enabled: !!selectedCategoryId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  })

  // --- Handle Logout Mutation ---
  const logoutMutation = useMutation({
    mutationFn: (body: { refresh_token: string }) => authApi.logout(body),
    onSuccess: () => {
      toast.success(AUTH_MESSAGE.LOGOUT_SUCCESS)
      resetAppContext()
      navidate(PATH.HOME)
    }
  })

  // --- Prefetch query khi hover ---
  const handleMouseEnter = (categoryId: number) => {
    const cacheData = queryClient.getQueryData(['getBrandsByCategoryId', categoryId])
    if (!cacheData) {
      queryClient.prefetchQuery({
        queryKey: ['getBrandsByCategoryId', categoryId],
        queryFn: () => categoryApi.getBrandsByCategoryId(categoryId),
        staleTime: 5 * 60 * 1000
      })
    }
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId)
    }
  }

  // --- Handle Open Mobile Menu ---
  const handleOpenMobile = () => setIsMobileMenuOpen(true)

  // --- Handle Open Mobile Search ---
  const handleOpenMobileSearch = () => setIsMobileSearchOpen(true)

  // --- Handle Close Mobile Menu ---
  const handleCloseMobile = () => {
    setMobileSelectedCategory(null)
    setIsMobileMenuOpen(false)
  }

  // --- Handle Close Mobile Search ---
  const handleCloseMobileSearch = () => setIsMobileSearchOpen(false)

  // --- Handle Mobile Category Click ---
  const handleMobileCategoryClick = async (category: CategoryType) => {
    const cacheData = queryClient.getQueryData(['getBrandsByCategoryId', category.id])
    if (!cacheData) {
      await queryClient.prefetchQuery({
        queryKey: ['getBrandsByCategoryId', category.id],
        queryFn: () => categoryApi.getBrandsByCategoryId(category.id),
        staleTime: 5 * 60 * 1000
      })
    }
    setMobileSelectedCategory(category)
  }

  // --- Handle Logout ---
  const handleLogout = () => {
    logoutMutation.mutate({ refresh_token: refreshToken as string })
  }

  const brands = getBrandsByCategoryId?.data?.data && getBrandsByCategoryId?.data?.data.data.brands
  const categories = getAllCategory?.data?.data && getAllCategory.data?.data.data.categories
  const mobileBrands =
    mobileSelectedCategory &&
    (queryClient.getQueryData<any>(['getBrandsByCategoryId', mobileSelectedCategory.id])?.data?.data?.brands || [])

  return (
    <header className='fixed top-0 left-0 right-0 z-50 w-full border-b border-solid border-gray-300 bg-white'>
      {/* --- Desktop --- */}
      <div className='max-w-7xl flex items-center mx-auto py-5 px-4'>
        {/* Left */}
        <div className='flex items-center'>
          {/* Mobile menu button */}
          <button
            onClick={handleOpenMobile}
            className='md:hidden py-2.5 px-2.5 rounded-full hover:bg-gray-100 bg-[#EAE9FC] mr-4'
          >
            <svg className='w-[20px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'>
              <path
                d='M2.5 15H17.5V13.3333H2.5V15ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM2.5 5V6.66667H17.5V5H2.5Z'
                fill='#4F46E5'
              />
            </svg>
          </button>
          {/* Logo */}
          <Link to={PATH.HOME} className='flex-shrink-0 text-xl font-bold text-indigo-600'>
            <img src={Logo} alt='logo' />
          </Link>
          {/* Desktop - Category dropdown */}
          <div
            className='group flex-shrink-0 relative hidden md:block ml-8'
            onMouseLeave={() => setSelectedCategoryId(null)}
          >
            <button className='flex items-center py-2 px-3 bg-[#EAE9FC] rounded-lg gap-x-2'>
              <span className='block text-[#4F46E5] text-[14px] font-semibold'>Danh mục</span>
              <img src={CategoryIcon} alt='' />
            </button>
            <div className='absolute mt-[5px] z-10 overflow-y-auto max-h-[346px] invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white flex flex-col translate-y-[10px] py-2 text-gray-800 rounded-md [box-shadow:0px_0px_8px_0px_rgba(0,_0,_0,_0.25)] left-0 min-w-[250px]'>
              {getAllCategory?.isLoading && (
                <span className='px-3 py-2 flex items-center gap-x-4 hover:bg-gray-100 transition'>
                  <span className='text-[#1A1A1A]'>Loading ...</span>
                </span>
              )}
              {categories &&
                categories.map((item: CategoryType) => (
                  <button
                    key={item.id}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    className='px-3 py-2 flex items-center gap-x-4 hover:bg-gray-100 transition'
                  >
                    <div className='p-2 rounded-lg bg-[#F5F5FA] w-12 h-12 flex items-center justify-center'>
                      <img src={item.image} alt={item.name} className='w-10 h-10 object-contain' />
                    </div>
                    <span className='text-[#1A1A1A] font-semibold'>{item.name}</span>
                  </button>
                ))}
            </div>
            {selectedCategoryId && (
              <div className='absolute right-0 mt-[15px] left-[250px] min-w-[300px] lg:min-w-[450px] max-w-[450px] overflow-y-auto h-[346px] p-6 bg-white rounded-md [box-shadow:0px_0px_8px_0px_rgba(0,_0,_0,_0.25)]'>
                <h3 className='font-semibold'>Thương hiệu</h3>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4'>
                  {getBrandsByCategoryId?.isLoading && (
                    <span className='py-2 flex items-center gap-x-4 hover:bg-gray-100 transition'>
                      <span className='text-[#1A1A1A]'>Loading ...</span>
                    </span>
                  )}
                  {brands &&
                    brands.map((brand: BrandType) => (
                      <div key={brand.id} className='flex flex-col items-center gap-2 justify-center'>
                        <button className='px-2 py-2 rounded-[14px] bg-[#F5F5FA] flex justify-center items-center'>
                          <img className='w-[64px] h-[58px] object-contain' src={brand.image} alt='' />
                        </button>
                        <span className='text-[13px] text-center'>{brand.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Search bar */}
        <form className='overflow-hidden relative hidden lg:flex items-center w-full lg:max-w-[450px] xl:max-w-[500px] ml-[25px] xl:ml-[32px] h-[44px] bg-[#E6E6E6] rounded-full'>
          <button className='pl-4 h-full'>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M15.755 14.255H14.965L14.685 13.985C15.665 12.845 16.255 11.365 16.255 9.755C16.255 6.165 13.345 3.255 9.755 3.255C6.165 3.255 3.255 6.165 3.255 9.755C3.255 13.345 6.165 16.255 9.755 16.255C11.365 16.255 12.845 15.665 13.985 14.685L14.255 14.965V15.755L19.255 20.745L20.745 19.255L15.755 14.255ZM9.755 14.255C7.26501 14.255 5.255 12.245 5.255 9.755C5.255 7.26501 7.26501 5.255 9.755 5.255C12.245 5.255 14.255 7.26501 14.255 9.755C14.255 12.245 12.245 14.255 9.755 14.255Z'
                fill='#B3B3B3'
              />
            </svg>
          </button>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm'
            className='w-full rounded-full h-full flex-1 bg-[#E6E6E6] placeholder:text-[#B3B3B3] text-[15px] outline-none py-3 pl-3 text-[#1A1A1A]'
          />
          <button className='h-full px-4'>
            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path
                d='M13.293 1.41016L7.70312 7L13.293 12.5898L12.5898 13.293L7 7.70312L1.41016 13.293L0.707031 12.5898L6.29688 7L0.707031 1.41016L1.41016 0.707031L7 6.29688L12.5898 0.707031L13.293 1.41016Z'
                fill='#121212'
                stroke='#1A1A1A'
              />
            </svg>
          </button>
        </form>
        {/* Right icons */}
        <div className='relative ml-auto flex items-center gap-x-[18px]'>
          <button className='bg-[#EAE9FC] hidden md:block p-2 md:p-2.5 rounded-[50%]'>
            <img src={Notification} alt='' />
          </button>
          <Link to={''} className='bg-[#EAE9FC] hidden md:block p-2 md:p-2.5 rounded-[50%]'>
            <img src={Cart} alt='' />
          </Link>
          <button onClick={handleOpenMobileSearch} className='bg-[#EAE9FC] block md:hidden rounded-[50%] p-[11px]'>
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
              <path
                d='M17.1052 15.076L13.86 11.8309C13.7136 11.6844 13.515 11.6031 13.3067 11.6031H12.7762C13.6745 10.4541 14.2083 9.00891 14.2083 7.4368C14.2083 3.69693 11.178 0.666626 7.43814 0.666626C3.69827 0.666626 0.667969 3.69693 0.667969 7.4368C0.667969 11.1767 3.69827 14.207 7.43814 14.207C9.01025 14.207 10.4554 13.6732 11.6044 12.7748V13.3054C11.6044 13.5137 11.6858 13.7122 11.8322 13.8587L15.0774 17.1038C15.3833 17.4098 15.8781 17.4098 16.1808 17.1038L17.1019 16.1827C17.4079 15.8767 17.4079 15.382 17.1052 15.076ZM7.43814 11.6031C5.13693 11.6031 3.27188 9.74126 3.27188 7.4368C3.27188 5.13559 5.13368 3.27054 7.43814 3.27054C9.73935 3.27054 11.6044 5.13234 11.6044 7.4368C11.6044 9.73801 9.7426 11.6031 7.43814 11.6031Z'
                fill='#4F46E5'
              />
            </svg>
          </button>
          {isAuthenticated ? (
            <div className='relative group'>
              <button className='bg-[#EAE9FC] rounded-[50%] w-10 md:w-11 cursor-pointer'>
                <img className='w-full object-cover rounded-[50%]' src={avatar || AvatarDefault} alt='avatar' />
              </button>
              <div className='absolute hidden md:block right-0 mt-3 w-[300px] bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-md [box-shadow:0px_0px_8px_0px_rgba(0,_0,_0,_0.25)]'>
                <Link
                  to={PATH.PROFILE}
                  className='flex items-center gap-4 pt-5 pb-4 px-5 hover:underline transition-all duration-300 ease-in-out'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='0 0 22 24' fill='none'>
                    <path
                      d='M11.0013 12C14.2233 12 16.8346 9.38867 16.8346 6.16667C16.8346 2.94466 14.2233 0.333336 11.0013 0.333336C7.7793 0.333336 5.16797 2.94466 5.16797 6.16667C5.16797 9.38867 7.7793 12 11.0013 12ZM15.0846 13.4583H14.3236C13.3118 13.9232 12.1862 14.1875 11.0013 14.1875C9.81641 14.1875 8.69531 13.9232 7.67904 13.4583H6.91797C3.53646 13.4583 0.792969 16.2018 0.792969 19.5833V21.4792C0.792969 22.6869 1.77279 23.6667 2.98047 23.6667H19.0221C20.2298 23.6667 21.2096 22.6869 21.2096 21.4792V19.5833C21.2096 16.2018 18.4661 13.4583 15.0846 13.4583Z'
                      fill='#4F46E5'
                    />
                  </svg>
                  <span className='text-[#333] font-semibold'>Thông tin cá nhân</span>
                </Link>
                <Link
                  to={''}
                  className='flex items-center gap-4 py-[18px] px-5 hover:underline transition-all duration-300 ease-in-out'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='0 0 24 22' fill='none'>
                    <path
                      d='M21.7258 12.8358L23.6408 4.40991C23.779 3.80154 23.3166 3.22222 22.6927 3.22222H6.78143L6.41012 1.407C6.3176 0.954552 5.91947 0.629627 5.45763 0.629627H1.30425C0.767303 0.629627 0.332031 1.0649 0.332031 1.60185V2.25C0.332031 2.78695 0.767303 3.22222 1.30425 3.22222H4.13516L6.98086 17.1345C6.30006 17.526 5.84129 18.2602 5.84129 19.1019C5.84129 20.3547 6.85694 21.3704 8.10981 21.3704C9.36268 21.3704 10.3783 20.3547 10.3783 19.1019C10.3783 18.4669 10.1172 17.8933 9.6968 17.4815H18.1894C17.7691 17.8933 17.508 18.4669 17.508 19.1019C17.508 20.3547 18.5236 21.3704 19.7765 21.3704C21.0293 21.3704 22.045 20.3547 22.045 19.1019C22.045 18.2037 21.5229 17.4275 20.7658 17.06L20.9892 16.0766C21.1275 15.4682 20.6651 14.8889 20.0412 14.8889H9.16779L8.90266 13.5926H20.7777C21.2317 13.5926 21.6252 13.2785 21.7258 12.8358Z'
                      fill='#4F46E5'
                    />
                  </svg>
                  <span className='text-[#333] font-semibold'>Đơn hàng của tôi</span>
                </Link>
                <Link
                  to={''}
                  className='flex items-center gap-4 pt-4 pb-5 px-5 hover:underline transition-all duration-300 ease-in-out'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='0 0 22 24' fill='none'>
                    <path
                      d='M11.0013 23.6667C12.611 23.6667 13.9166 22.361 13.9166 20.75H8.08603C8.08603 22.361 9.3917 23.6667 11.0013 23.6667ZM20.8173 16.8439C19.9368 15.8979 18.2894 14.4746 18.2894 9.8125C18.2894 6.27149 15.8065 3.43685 12.4588 2.74141V1.79167C12.4588 0.986396 11.8062 0.333336 11.0013 0.333336C10.1965 0.333336 9.54391 0.986396 9.54391 1.79167V2.74141C6.19613 3.43685 3.71331 6.27149 3.71331 9.8125C3.71331 14.4746 2.06585 15.8979 1.18538 16.8439C0.911946 17.1379 0.790722 17.4893 0.793 17.8333C0.798013 18.5807 1.38454 19.2917 2.25589 19.2917H19.7468C20.6181 19.2917 21.2051 18.5807 21.2097 17.8333C21.2119 17.4893 21.0907 17.1374 20.8173 16.8439V16.8439Z'
                      fill='#4F46E5'
                    />
                  </svg>
                  <span className='text-[#333] font-semibold'>Thông báo</span>
                </Link>
                <div className='px-5 pb-4'>
                  <button
                    onClick={handleLogout}
                    className='w-full bg-blue-600 hover:bg-blue-700 mt-1 text-white py-3 rounded-lg font-medium transition'
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to={PATH.LOGIN} className='bg-[#EAE9FC] rounded-[50%] p-2 md:p-2.5'>
              <img src={User} alt='avatar' />
            </Link>
          )}
        </div>
      </div>

      {/* --- Mobile --- */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 z-40' onClick={handleCloseMobile}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:max-w-[400px] bg-white z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-4 border-b border-solid border-gray-200'>
          {mobileSelectedCategory ? (
            <div className='flex items-center gap-4'>
              <button onClick={() => setMobileSelectedCategory(null)} className='bg-[#EAE9FC] p-3.5 rounded-[50%]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 18' fill='none'>
                  <path
                    d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
                    fill='#4F46E5'
                  />
                </svg>
              </button>
              <h3 className='font-semibold mt-2 mb-3 text-[16px]'>{mobileSelectedCategory.name}</h3>
            </div>
          ) : (
            <>
              <Link to={PATH.HOME} className='flex-shrink-0 text-xl font-bold text-indigo-600'>
                <img src={Logo} alt='logo' />
              </Link>
              <button onClick={handleCloseMobile} className='bg-[#EAE9FC] p-3.5 rounded-[50%]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path
                    d='M11.8332 1.34166L10.6582 0.166656L5.99984 4.82499L1.3415 0.166656L0.166504 1.34166L4.82484 5.99999L0.166504 10.6583L1.3415 11.8333L5.99984 7.17499L10.6582 11.8333L11.8332 10.6583L7.17484 5.99999L11.8332 1.34166Z'
                    fill='#4F46E5'
                  />
                </svg>
              </button>
            </>
          )}
        </div>
        {/* Màn hình danh mục */}
        {!mobileSelectedCategory && (
          <div className='overflow-y-auto h-full pb-20'>
            {/* Khi chưa login hiển thị Đăng nhập / đăng ký và ngược lại */}
            {isAuthenticated ? (
              <>
                <Link to={PATH.PROFILE} className='block mx-4 my-3 p-4 border bg-[#EAE9FC] rounded-lg'>
                  <div className='flex items-center'>
                    <div className='bg-[#EAE9FC] rounded-[50%] w-10 md:w-11 flex-shrink-0'>
                      <img className='w-full object-cover rounded-[50%]' src={avatar || AvatarDefault} alt='avatar' />
                    </div>
                    <div className='ml-3 h-full'>
                      <h3 className='text-primary text-[16px] font-semibold max-w-[250px] leading-[1.5] truncate'>
                        {fullName}
                      </h3>
                      <span className='block text-sm text-[#666]'>@{getUsernameFromEmail(email)}</span>
                    </div>
                    <button className='ml-auto'>
                      <span className='px-1 py-[2px]'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='8' height='14' viewBox='0 0 8 14' fill='none'>
                          <path
                            d='M0.0766602 12.4867L1.25666 13.6667L7.92333 7L1.25666 0.333336L0.0766602 1.51334L5.56333 7L0.0766602 12.4867Z'
                            fill='#666666'
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <div className='mx-4 my-3 p-4 border bg-[#EAE9FC] rounded-lg'>
                  <p className='text-sm mb-4 text-[#000000] leading-[1.5]'>
                    Đăng ký hoặc đăng nhập để được hưởng các chương trình ưu đãi
                  </p>
                  <div className='flex gap-3'>
                    <Link
                      to={PATH.REGISTER}
                      className='flex-1 border border-[#4F46E5] border-solid rounded-lg bg-[white] text-[#4F46E5] py-2 text-center text-sm font-semibold'
                    >
                      Đăng ký
                    </Link>
                    <Link
                      to={PATH.LOGIN}
                      className='flex-1 bg-[#4F46E5] text-white rounded-lg py-2 text-center text-sm font-semibold'
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </div>
              </>
            )}
            {/* Danh mục */}
            <div className='flex flex-col'>
              {categories &&
                categories.map((item: CategoryType) => (
                  <button
                    key={item.id}
                    onClick={() => handleMobileCategoryClick(item)}
                    className='flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-[#F5F5FA] w-12 h-12 flex items-center justify-center'>
                        <img src={item.image} alt={item.name} className='w-10 h-10 object-contain' />
                      </div>
                      <span className='text-[#1A1A1A] font-medium text-sm'>{item.name}</span>
                    </div>
                    <span className='px-1 py-[2px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path
                          d='M0.0766602 12.4867L1.25666 13.6667L7.92333 7L1.25666 0.333336L0.0766602 1.51334L5.56333 7L0.0766602 12.4867Z'
                          fill='#666666'
                        />
                      </svg>
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}
        {/* Màn hình thương hiệu */}
        {mobileSelectedCategory && (
          <div className='overflow-y-auto h-full pb-10 p-4'>
            <h4 className='text-sm font-semibold mb-3'>Thương hiệu</h4>
            <div className='grid grid-cols-4 gap-4'>
              {mobileBrands?.map((brand: BrandType) => (
                <div key={brand.id} className='flex flex-col items-center gap-2'>
                  <div className='px-2 py-2 rounded-[14px] bg-[#F5F5FA] flex justify-center items-center'>
                    <img className='w-[64px] h-[58px] object-contain' src={brand.image} alt={brand.name} />
                  </div>
                  <span className='text-[13px]'>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- Mobile Search --- */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isMobileSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileSearchOpen ? 'bg-opacity-40' : 'bg-opacity-0'
          }`}
          onClick={handleCloseMobileSearch}
        ></div>
        {/* Search */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-white transform transition-transform duration-300 ${
            isMobileSearchOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Search */}
          <div className='flex items-center px-4 py-3 border-b border-solid border-gray-200'>
            <button onClick={handleCloseMobileSearch} className='mr-[14px] bg-[#EAE9FC] p-3 rounded-full'>
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
                <path
                  d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
                  fill='#4F46E5'
                />
              </svg>
            </button>
            <form className='flex-1 relative bg-[#E6E6E6] rounded-full'>
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm'
                className='w-full rounded-full h-[40px] pl-10 pr-4 bg-transparent placeholder:text-[#B3B3B3] text-sm outline-none'
              />
              <svg
                className='absolute left-3 top-1/2 -translate-y-1/2'
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
              >
                <path
                  d='M11.3137 10.0596H10.6553L10.422 9.83463C11.422 8.66796 11.9387 7.0763 11.6553 5.38463C11.2637 3.06796 9.33034 1.21796 6.99701 0.934629C3.47201 0.501295 0.505339 3.46796 0.938672 6.99296C1.22201 9.3263 3.07201 11.2596 5.38867 11.6513C7.08034 11.9346 8.67201 11.418 9.83867 10.418L10.0637 10.6513V11.3096L13.6053 14.8513C13.947 15.193 14.5053 15.193 14.847 14.8513C15.1887 14.5096 15.1887 13.9513 14.847 13.6096L11.3137 10.0596ZM6.31367 10.0596C4.23867 10.0596 2.56367 8.38463 2.56367 6.30963C2.56367 4.23463 4.23867 2.55963 6.31367 2.55963C8.38867 2.55963 10.0637 4.23463 10.0637 6.30963C10.0637 8.38463 8.38867 10.0596 6.31367 10.0596Z'
                  fill='#B3B3B3'
                />
              </svg>
            </form>
          </div>
          {/* Từ khóa nổi bật */}
          <div className='px-4 py-4'>
            <h4 className='text-sm font-semibold text-[#1A1A1A] mb-3'>Từ khóa nổi bật</h4>
            <div className='flex flex-wrap gap-3'>
              {['Iphone 16 Pro', 'Xiaomi 14T', 'Oppo ra sản phẩm mới', 'Gucci ra mắt bộ sưu tập', 'LLV ra mắt'].map(
                (keyword, index) => (
                  <button
                    key={index}
                    className='px-4 py-2 border border-gray-300 rounded-full text-sm bg-white hover:bg-gray-100 transition'
                  >
                    {keyword}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
