import ProductListSection from '../../../components/ProductListSection'
import HomeBannerSlider from './components/HomeBannerSlider'
import HomeFeaturedCategories from './components/HomeFeaturedCategories'
import HomeProductSuggestions from './components/HomeProductSuggestions'

export default function Home() {
  return (
    <>
      <main className=''>
        <HomeBannerSlider />
        <HomeFeaturedCategories />
        <ProductListSection title='Deal chớp nhoáng' />
        <HomeProductSuggestions />
      </main>
      <ProductListSection option={true} title='Lịch sử xem' background='white' />
    </>
  )
}
