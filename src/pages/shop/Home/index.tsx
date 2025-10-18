import HomeBannerSlider from './components/HomeBannerSlider'
import HomeFeaturedCategories from './components/HomeFeaturedCategories'
import HomeFlashSale from './components/HomeFlashSale'
import HomeProductSuggestions from './components/HomeProductSuggestions'

export default function Home() {
  return (
    <main className='h-[5000px]'>
      <HomeBannerSlider />
      <HomeFeaturedCategories />
      <HomeFlashSale />
      <HomeProductSuggestions />
    </main>
  )
}
