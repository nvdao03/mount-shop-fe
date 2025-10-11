import HomeBannerSlider from './components/HomeBannerSlider'
import HomeFeaturedCategories from './components/HomeFeaturedCategories'

export default function Home() {
  return (
    <main className='mt-[96px] md:mt-[117px] h-[5000px]'>
      <HomeBannerSlider />
      <HomeFeaturedCategories />
    </main>
  )
}
