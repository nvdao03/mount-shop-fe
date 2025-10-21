import type { BrandType } from '../../../../types/brand.type'

interface PropTypes {
  // --- Variables --- //
  brands: BrandType[]

  // --- State and Set State --- //
  isFilterOpen: boolean
  checkPriceLevel: number | undefined
  rating: number | undefined
  brandIds: number[]
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
  setMinPriceInput: React.Dispatch<React.SetStateAction<string>>
  setMaxPriceInput: React.Dispatch<React.SetStateAction<string>>

  // --- Functions --- //
  handleOnChangePriceLevelAll: () => void
  handleOnChangeInputPriceLevel: (item: {
    id: number
    idInput: string
    label: string
    minPrice: number
    maxPrice: number
  }) => void
  handleApplyPrice: () => void
  handleResetFilterForMobile: () => void
  handleOnChangeInputRatingAll: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleOnChangeInputRating: (e: React.ChangeEvent<HTMLInputElement>, ratingValue: number) => void
  handleOnChangeInputBrand: (e: React.ChangeEvent<HTMLInputElement>, brand_id: number) => void
  handleOnChangeInputBrandAll: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ProductListFilterMobileDrawer({
  brands,
  isFilterOpen,
  checkPriceLevel,
  rating,
  brandIds,
  setIsFilterOpen,
  setMinPriceInput,
  setMaxPriceInput,
  handleOnChangePriceLevelAll,
  handleOnChangeInputPriceLevel,
  handleApplyPrice,
  handleResetFilterForMobile,
  handleOnChangeInputRatingAll,
  handleOnChangeInputRating,
  handleOnChangeInputBrand,
  handleOnChangeInputBrandAll
}: PropTypes) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:hidden transition-opacity duration-500 ease-in-out ${
        isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={() => setIsFilterOpen(false)}
    >
      <div
        className={`flex flex-col w-full h-[95%] bg-white shadow-lg rounded-t-2xl transition-all transform duration-500 ease-out ${
          isFilterOpen ? ' translate-y-0 opacity-100' : 'translate-y-full opacity-0'
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
            onClick={() => setIsFilterOpen(false)}
            className='flex justify-center items-center bg-[#EAE9FC] p-2.5 rounded-full'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 18 12' fill='none'>
              <path
                d='M8.11984 11.0146L1.03429 3.92909C0.544558 3.43936 0.544558 2.64744 1.03429 2.16292L2.21175 0.985466C2.70148 0.49573 3.4934 0.49573 3.97792 0.985466L9.00033 6.00787L14.0227 0.985466C14.5125 0.49573 15.3044 0.49573 15.7889 0.985466L16.9664 2.16292C17.4561 2.65265 17.4561 3.44457 16.9664 3.92909L9.88081 11.0146C9.40149 11.5044 8.60958 11.5044 8.11984 11.0146V11.0146Z'
                fill='#4F46E5'
              />
            </svg>
          </button>
          <h2 className='text-[16px] font-semibold'>Bộ lọc</h2>
        </div>
        {/* --- Nội dung --- */}
        <div className='flex-1 overflow-y-auto h-[calc(100%-120px)] p-4'>
          {/* Option price */}
          <div>
            <h3 className='font-semibold text-[16px]'>Mức giá</h3>
            <ul className='mt-[10px] text-[14px]'>
              <li>
                <div className='flex items-center gap-2 cursor-pointer w-full'>
                  <input
                    type='checkbox'
                    name='price'
                    id={'price-all'}
                    onChange={() => handleOnChangePriceLevelAll()}
                    checked={checkPriceLevel === undefined}
                  />
                  <label className='w-full cursor-pointer py-2 select-none' htmlFor={'price-all'}>
                    Tất cả
                  </label>
                </div>
              </li>
              {[
                { id: 0, idInput: 'price-under-2m', label: 'Dưới 2 triệu', minPrice: 0, maxPrice: 2000000 },
                { id: 1, idInput: 'price-2-4m', label: 'Từ 2 đến 4 triệu', minPrice: 2000000, maxPrice: 4000000 },
                { id: 2, idInput: 'price-4-8m', label: 'Từ 4 đến 8 triệu', minPrice: 4000000, maxPrice: 8000000 },
                { id: 3, idInput: 'price-8-10m', label: 'Từ 8 đến 10 triệu', minPrice: 8000000, maxPrice: 10000000 }
              ].map((item) => (
                <li key={item.idInput}>
                  <div className='flex items-center gap-2 cursor-pointer w-full'>
                    <input
                      type='checkbox'
                      name='price'
                      id={item.idInput}
                      onChange={() => handleOnChangeInputPriceLevel(item)}
                      checked={checkPriceLevel === item.id}
                    />
                    <label className='w-full cursor-pointer py-2 select-none' htmlFor={item.idInput}>
                      {item.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Option price between */}
          <div>
            <h3 className='font-semibold text-[16px] mt-5 leading-[1.5]'>Tùy chọn khoảng giá</h3>
            <div className='mt-5 flex flex-row items-center gap-2 lg:gap-3'>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPriceInput(e.target.value)}
                type='number'
                className='flex-1 min-w-0 border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-[14px] py-2 px-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Từ'
              />
              <span className='block after:content-[""] after:block after:relative after:w-3 after:h-[2px] after:bg-[#E6E6E6] after:text-[20px]'></span>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPriceInput(e.target.value)}
                type='number'
                className='flex-1 min-w-0 border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-[14px] py-2 px-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Đến'
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className='mt-4 w-full bg-primary text-white rounded-lg py-2 px-5 text-center text-sm font-semibold'
            >
              Áp dụng
            </button>
          </div>
          {/* Option brands */}
          <div>
            <h3 className='font-semibold text-[16px] mt-7'>Thương hiệu</h3>
            <ul className='mt-[10px] text-[14px]'>
              <li>
                <div className='flex items-center gap-2 cursor-pointer w-full'>
                  <input
                    type='checkbox'
                    id='brand-all'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChangeInputBrandAll(e)}
                    checked={brandIds.length === 0}
                  />
                  <label className='w-full cursor-pointer py-2 select-none' htmlFor='brand-all'>
                    Tất cả
                  </label>
                </div>
              </li>
              {brands &&
                brands.map((brand: BrandType) => (
                  <li key={brand.id}>
                    <div className='flex items-center gap-2 cursor-pointer w-full'>
                      <input
                        type='checkbox'
                        name=''
                        id={String(brand.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChangeInputBrand(e, brand.id)}
                        checked={brandIds.includes(brand.id)}
                      />
                      <label className='w-full cursor-pointer py-2 select-none' htmlFor={String(brand.id)}>
                        {brand.name}
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          {/* Option rating star */}
          <div>
            <h3 className='font-semibold text-[16px] mt-5'>Đánh giá</h3>
            <ul className='mt-[10px] text-[14px]'>
              <li>
                <div className='flex items-center gap-2 cursor-pointer w-full'>
                  <input
                    type='checkbox'
                    name=''
                    id='star-all'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChangeInputRatingAll(e)}
                    checked={rating === undefined}
                  />
                  <label className='w-full cursor-pointer py-2 select-none' htmlFor='star-all'>
                    Tất cả
                  </label>
                </div>
              </li>
              {Array.from({ length: 5 }).map((_, index) => {
                const ratingValue = 5 - index
                return (
                  <li key={ratingValue}>
                    <div className='flex items-center gap-2 cursor-pointer w-full'>
                      <input
                        type='checkbox'
                        name=''
                        id={`star-${ratingValue}`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChangeInputRating(e, ratingValue)}
                        checked={rating === ratingValue}
                      />
                      <label className='w-full cursor-pointer py-2 select-none' htmlFor={`star-${ratingValue}`}>
                        {ratingValue} sao
                      </label>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        {/* --- Action --- */}
        <div className='mt-auto p-4 border-t [box-shadow:0_-1px_8px_0_rgba(0,_0,_0,_0.15)] border-[#E6E6E6] bg-white flex justify-between gap-3'>
          <button
            onClick={handleResetFilterForMobile}
            className='flex-1 border border-red-500 text-red-500 rounded-lg py-3 font-semibold'
          >
            Đặt lại
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className='flex-1 bg-primary text-white rounded-lg py-3 font-semibold'
          >
            Lọc
          </button>
        </div>
      </div>
    </div>
  )
}
