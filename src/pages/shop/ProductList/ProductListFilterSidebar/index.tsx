import type { BrandType } from '../../../../types/brand.type'

interface PropTypes {
  // --- Variable --- //
  brands: BrandType[]

  // --- State and Set State --- //
  checkPriceLevel: number | undefined
  brandIds: number[]
  rating: number | undefined
  search: string
  setMinPriceInput: React.Dispatch<React.SetStateAction<string>>
  setMaxPriceInput: React.Dispatch<React.SetStateAction<string>>

  // --- Fuction --- //
  handleOnChangeInputPriceLevel: (item: {
    id: number
    idInput: string
    label: string
    minPrice: number
    maxPrice: number
  }) => void
  handleApplyPrice: () => void
  handleOnChangePriceLevelAll: () => void
  handleOnChangeInputRatingAll: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleOnChangeInputRating: (e: React.ChangeEvent<HTMLInputElement>, ratingValue: number) => void
  handleOnChangeInputBrand: (e: React.ChangeEvent<HTMLInputElement>, brand_id: number) => void
  handleOnChangeInputBrandAll: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ProductListFilterSidebar({
  brands,
  checkPriceLevel,
  brandIds,
  rating,
  search,
  setMinPriceInput,
  setMaxPriceInput,
  handleOnChangeInputPriceLevel,
  handleApplyPrice,
  handleOnChangePriceLevelAll,
  handleOnChangeInputRatingAll,
  handleOnChangeInputRating,
  handleOnChangeInputBrand,
  handleOnChangeInputBrandAll
}: PropTypes) {
  return (
    <section className='hidden md:block md:col-span-4 lg:col-span-3 bg-white rounded-[10px]'>
      {/* Title */}
      <div className='p-4 border-b border-solid border-[#E6E6E6]'>
        <span className='text-[17px] font-semibold'>Bộ lọc tìm kiếm</span>
      </div>
      {/* Filter */}
      <div className='p-4'>
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
        {!search && (
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
        )}
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
    </section>
  )
}
