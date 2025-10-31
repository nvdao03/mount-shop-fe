import { Link } from 'react-router-dom'
import { PATH } from '../../constants/path'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[#F5F5F9] text-center px-4'>
      <div className='max-w-md'>
        <h1 className='text-[6rem] font-bold text-gray-800 mb-2'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-3'>
          Page Not Found <span className='ml-1'>⚠️</span>
        </h2>
        <p className='text-gray-500 mb-6'>We couldn’t find the page you are looking for.</p>
        <Link
          to={PATH.HOME}
          className='inline-block px-6 py-3 rounded-md text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition'
        >
          Back To Home
        </Link>
        <div className='mt-10'>
          <img
            src='https://mount-shop-s3.s3.ap-southeast-1.amazonaws.com/images/re5uy8qlrsyko7hi0xk7om01h.png'
            alt='Not Found Illustration'
            className='w-full max-w-sm mx-auto'
          />
        </div>
      </div>
    </div>
  )
}
