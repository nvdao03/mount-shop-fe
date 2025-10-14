import HomeBannerSlider from './components/HomeBannerSlider'
import HomeFeaturedCategories from './components/HomeFeaturedCategories'
import HomeFlashSale from './components/HomeFlashSale'

export default function Home() {
  return (
    <main className='h-[5000px]'>
      <HomeBannerSlider />
      <HomeFeaturedCategories />
      <HomeFlashSale />
    </main>
  )
}
